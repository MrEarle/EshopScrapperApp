import {
  Input,
  List,
  ListItem,
  Text,
  Button,
  Divider,
  Layout,
} from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import { Alert, Linking, View } from 'react-native'
import api from '../../api'
import { getPaginatedFetch } from '../../api/helper'
import BaseLayout from '../Navigation/AppHome'
import { RenderUnsubscribe, RenderCurrentPrice } from './item'

const fetchWatchlists = getPaginatedFetch('authed/subs')

const SubscribedWatchlist = () => {
  const [watchlists, setWatchlists] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageSize, setPageSize] = useState(10)
  const [itemCount, setItemCount] = useState(0)
  const [search, setSearch] = useState('')

  const onRefresh = async (page, _pageSize = null, search = null) => {
    setLoading(true)
    let { rows, count } = await fetchWatchlists(
      page,
      _pageSize || pageSize,
      search
    )
    rows = rows.map(
      ({ id, url, name, Subscription, currentPrice, priceUpdatedAt }) => ({
        id,
        url,
        name,
        currentPrice,
        priceUpdatedAt,
        maxPrice: Subscription.maxPrice,
      })
    )
    setItemCount(count)
    setWatchlists(() => rows)
    setLoading(false)
  }

  const onEndReached = () => {
    if (pageSize < itemCount) {
      onChangePagination(1, pageSize + 10)
    }
  }

  useEffect(() => {
    onRefresh(1, pageSize, search)
  }, [])

  const getOnUnsubscribe = (watchlistId) => {
    return async () => {
      await api.delete(`authed/subs/unsubscribe/${watchlistId}`)
      Alert.alert('Unubscribed Successfully')
      onRefresh(1, pageSize, search)
    }
  }

  const onChangePagination = (page, pageSize) => {
    setPageSize(pageSize)
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
          <RenderCurrentPrice
            currentPrice={currentPrice}
            priceUpdatedAt={priceUpdatedAt}
          />
          <RenderUnsubscribe onUnsubscribe={getOnUnsubscribe(id)} />
        </View>
      </ListItem>
    )
  }

  return (
    <BaseLayout>
      <Layout style={{ width: '100%', alignItems: 'center', padding: 10 }}>
        <Input
          value={search}
          onChangeText={(e) => setSearch(e)}
          onKeyPress={({ nativeEvent }) =>
            nativeEvent.key === 'Enter' && onRefresh(1, pageSize, search)
          }
          placeholder="Search"
        />
        <Button
          onPress={() => onRefresh(1, pageSize, search)}
          style={{ marginTop: 5, width: '100%' }}
        >
          Search
        </Button>
      </Layout>
      <List
        style={{ width: '100%' }}
        data={watchlists}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={!loading && <Text>There are no subscriptions</Text>}
        onRefresh={() => onRefresh(1, pageSize, search)}
        refreshing={loading}
      />
    </BaseLayout>
  )
}

export default SubscribedWatchlist
