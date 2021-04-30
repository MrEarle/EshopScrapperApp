import { Input, List, ListItem, Spinner, Text, Button, Divider, Layout } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native'
import api from '../../api'
import BaseLayout from '../Navigation/AppHome'
import { RenderUnsubscribe, RenderCurrentPrice } from './item'

const fetchWatchlists = async (page, pageSize, search) => {
  const offset = (page - 1) * pageSize
  const limit = offset + pageSize
  const { result } = await api.get('authed/subs', null, {
    offset,
    limit,
    search,
  })
  const rows = result.rows.map(({ id, url, name, Subscription, currentPrice, priceUpdatedAt }) => ({
    id,
    url,
    name,
    currentPrice,
    priceUpdatedAt,
    maxPrice: Subscription.maxPrice,
  }))
  return { rows, count: result.count }
}

const SubscribedWatchlist = () => {
  const [watchlists, setWatchlists] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageSize: 10,
    hideOnSinglePage: true,
    responsive: true,
    total: 0,
    position: 'both',
    current: 1,
  })
  const [search, setSearch] = useState('')

  const onRefresh = async (page, pageSize = null, search = null) => {
    setLoading(true)
    const { rows, count } = await fetchWatchlists(
      page,
      pageSize || pagination.pageSize,
      search
    )
    setPagination((pagination) => ({ ...pagination, total: count }))
    setWatchlists(() => rows)
    setLoading(false)
  }

  const onEndReached = () => {
    if (pagination.pageSize < pagination.total) {
      onChangePagination(1, pagination.pageSize + 10)
    }
  }

  useEffect(() => {
    onRefresh(pagination.current, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getOnUnsubscribe = (watchlistId) => {
    return async () => {
      await api.delete(`authed/subs/unsubscribe/${watchlistId}`)
      Alert.alert('Unubscribed Successfully')
      onRefresh(pagination.current, search)
    }
  }

  const onChangePagination = (page, pageSize) => {
    setPagination((old) => ({ ...old, current: page, pageSize }))
    onRefresh(page, pageSize, search)
  }

  const renderItem = ({ item }) => {
    const { id, url, name, currentPrice, priceUpdatedAt, maxPrice } = item
    return (
      <ListItem>
        <View style={{ width: '100%' }}>
          <Text category="h5" onPress={() => Linking.openURL(url)}>
            {name}
          </Text>
          <Text category="s1">{`Max Price: $${maxPrice}`}</Text>
          <RenderCurrentPrice currentPrice={currentPrice} priceUpdatedAt={priceUpdatedAt} />
          <RenderUnsubscribe onUnsubscribe={getOnUnsubscribe(id)} />
        </View>
      </ListItem>
    )
  }

  return (
    <BaseLayout>
      <Layout style={{ width: "100%", alignItems: "center", padding: 10 }}>
        <Input
          value={search}
          onChangeText={(e) => setSearch(e)}
          onKeyPress={({ nativeEvent }) => nativeEvent.key === "Enter" && onRefresh(pagination.current, value)}
          placeholder="Search"
        />
        <Button
          onPress={() => onRefresh(pagination.current, search)}
          style={{ marginTop: 5, width: "100%" }}
        >
          Search
        </Button>
      </Layout>
      <List
        // pagination={{ ...pagination, onChange: onChangePagination }}
        style={{ width: "100%" }}
        data={watchlists}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={!loading && <Text>There are no subscriptions</Text>}
        onRefresh={() => onRefresh(1)}
        refreshing={loading}
      />
    </BaseLayout>
  )
}

export default SubscribedWatchlist
