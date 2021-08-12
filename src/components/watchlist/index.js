import React, { useEffect, useState } from 'react'
import api from '../../api'
import RenderSubscribe, { RenderCurrentPrice } from './item'
import { Alert, Linking, View } from 'react-native'
import BaseLayout from '../Navigation/AppHome'
import {
  Button,
  Divider,
  Input,
  Layout,
  List,
  ListItem,
  Text,
} from '@ui-kitten/components'
import { getPaginatedFetch } from '../../api/helper'

const fetchWatchlists = getPaginatedFetch('authed/watchlist')

const Watchlist = () => {
  const [pageSize, setPageSize] = useState(10)
  const [itemCount, setItemCount] = useState(0)
  const [search, setSearch] = useState('')
  const [watchlists, setWatchlists] = useState([])
  const [loading, setLoading] = useState(true)

  const onRefresh = async (page, _pageSize = null, search = null) => {
    setLoading(true)
    const { count, rows } = await fetchWatchlists(
      page,
      _pageSize || pageSize,
      search
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

  const onChangePagination = (page, pageSize) => {
    setPageSize(pageSize)
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
          <RenderCurrentPrice
            currentPrice={currentPrice}
            priceUpdatedAt={priceUpdatedAt}
          />
        </View>
      </ListItem>
    )
  }

  return (
    <BaseLayout
      style={{
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
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
        onRefresh={() => onRefresh(1, pageSize, search)}
        ListEmptyComponent={!loading && <Text>No games match your search</Text>}
        refreshing={loading}
        keyExtractor={({ id }) => id}
      />
    </BaseLayout>
  )
}

export default Watchlist
