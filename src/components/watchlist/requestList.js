import { Text, Divider, List, ListItem } from '@ui-kitten/components'
import React, { useEffect } from 'react'
import { useState } from 'react'
import BaseLayout from '../Navigation/AppHome'
import RequestItem from './requestItem'
import { getPaginatedFetch } from '../../api/helper'

const fetchRequests = getPaginatedFetch('authed/request')

const RequestList = () => {
  const [requests, setRequests] = useState([])

  const [loading, setLoading] = useState(true)
  const [pageSize, setPageSize] = useState(10)
  const [itemCount, setItemCount] = useState(0)

  const onRefresh = async (page, _pageSize = null, search = null) => {
    setLoading(true)
    const { count, rows } = await fetchRequests(
      page,
      _pageSize || pageSize,
      search
    )
    setItemCount(count)
    setRequests(() => rows)
    setLoading(false)
  }

  const onEndReached = () => {
    if (pageSize < itemCount) {
      onChangePagination(1, pageSize + 10)
    }
  }

  useEffect(() => {
    onRefresh(1, pageSize)
  }, [])

  const onChangePagination = (page, pageSize) => {
    setPageSize(pageSize)
    onRefresh(page, pageSize)
  }

  const renderItem = ({ item }) => {
    return (
      <ListItem>
        <RequestItem request={item} onSubmit={() => onRefresh(1)} />
      </ListItem>
    )
  }

  return (
    <BaseLayout>
      <List
        style={{ width: '100%', marginBottom: 100 }}
        data={requests}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={!loading && <Text>There are no requests!</Text>}
        onRefresh={() => onRefresh(1)}
        refreshing={loading}
        keyExtractor={({ id }) => id}
      />
    </BaseLayout>
  )
}

export default RequestList
