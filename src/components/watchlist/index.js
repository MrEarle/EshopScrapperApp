import React, { useEffect, useState } from 'react'
import api from '../../api'
import RenderSubscribe, { RenderCurrentPrice } from './item'
import { Alert, Linking, View } from 'react-native'
import BaseLayout from '../Navigation/AppHome'
import { Button, Divider, Input, Layout, List, ListItem, Spinner, Text } from '@ui-kitten/components'

const fetchWatchlists = async (page, pageSize, search) => {
  const offset = (page - 1) * pageSize
  const limit = offset + pageSize
  const { result } = await api.get('authed/watchlist', null, {
    offset,
    limit,
    search,
  })
  return result
}

const Watchlist = () => {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    hideOnSinglePage: true,
    responsive: true,
    total: 0,
    position: 'both',
    current: 1,
  })
  const [search, setSearch] = useState('')
  const [watchlists, setWatchlists] = useState([])
  const [loading, setLoading] = useState(true)

  const onRefresh = async (page, pageSize = null, search = null) => {
    setLoading(true)
    const { count, rows } = await fetchWatchlists(
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

  const onChangePagination = (page, pageSize) => {
    setPagination((old) => ({ ...old, current: page, pageSize }))
    onRefresh(page, pageSize, search)
  }

  const getOnSubscribe = (watchlistId) => {
    return async (maxPrice) => {
      if (+maxPrice < 0) return
      await api.post(`authed/subs/subscribe/${watchlistId}`, {
        maxPrice: +maxPrice,
      })
      Alert.alert('Subscribed Successfully')
    }
  }

  const renderItem = ({ item }) => {
    const { id, url, name, currentPrice, priceUpdatedAt } = item
    return (
      <ListItem>
        <View style={{ width: '100%' }}>
          <Text category="h5" onPress={() => Linking.openURL(url)}>
            {name}
          </Text>
          <RenderSubscribe onSubscribe={getOnSubscribe(id)} />
          <RenderCurrentPrice currentPrice={currentPrice} priceUpdatedAt={priceUpdatedAt} />
        </View>
      </ListItem>
    )
  }

  return (
    <BaseLayout
      style={{
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}
    >
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
        onRefresh={() => onRefresh(1)}
        refreshing={loading}
      />
    </BaseLayout>
  )
}

export default Watchlist
