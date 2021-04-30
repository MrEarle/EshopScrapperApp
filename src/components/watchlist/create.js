import { Input, Button, Text, Spinner, Divider, List, ListItem, Layout } from '@ui-kitten/components'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Alert, View } from 'react-native'
import validator from 'validator'
import api from '../../api'
import BaseLayout from '../Navigation/AppHome'
import RequestItem from './requestItem'

const validateEshopUrl = (url) => {
  const pattern = /^https:\/\/eshop-prices\.com\/games\/(\d+)-.+$/
  const match = pattern.exec(url)
  if (!match) return null
  return match && match[1]
}

const fetchRequests = async (page, pageSize, search) => {
  const offset = (page - 1) * pageSize
  const limit = offset + pageSize
  const { result } = await api.get('authed/request', null, {
    offset,
    limit,
    search,
  })
  return result
}

const CreateWatchlist = () => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const [nameValid, setNameValid] = useState(true)
  const [urlValid, setUrlValid] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const [requests, setRequests] = useState([])

  const validateAll = () => {
    return (
      name &&
      url &&
      validator.isLength(name, { min: 1 }) &&
      validator.isURL(url) &&
      validateEshopUrl(url)
    )
  }

  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageSize: 10,
    hideOnSinglePage: true,
    responsive: true,
    total: 0,
    position: 'both',
    current: 1,
  })

  const onRefresh = async (page, pageSize = null, search = null) => {
    setLoading(true)
    const { count, rows } = await fetchRequests(
      page,
      pageSize || pagination.pageSize,
      search
    )
    setPagination((pagination) => ({ ...pagination, total: count }))
    setRequests(() => rows)
    setLoading(false)
  }

  const onEndReached = () => {
    if (pagination.pageSize < pagination.total) {
      onChangePagination(1, pagination.pageSize + 10)
    }
  }

  useEffect(() => {
    onRefresh(pagination.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangePagination = (page, pageSize) => {
    setPagination((old) => ({ ...old, current: page, pageSize }))
    onRefresh(page, pageSize, search)
  }

  const onFinish = async () => {
    setIsLoading(true)
    try {
      const resp = await api.post('authed/watchlist', {
        name,
        url,
      })
      if (!resp) return false
      Alert.alert('Game successfully created!')
    } catch (err) {
      Alert.alert('There was an error creating the game')
    }
    setIsLoading(false)
  }

  const renderItem = ({ item }) => {
    return (
      <ListItem>
        <RequestItem request={item} />
      </ListItem>
    )
  }

  return (
    <BaseLayout>
      <Input
        value={name}
        label="Name"
        placeholder="name"
        onChangeText={setName}
        autoCapitalize="sentences"
        style={{ marginBottom: 10 }}
        status={nameValid ? 'primary' : 'danger'}
        onBlur={() => setNameValid(validator.isLength(name, { min: 1 }))}
        caption={nameValid ? null : 'Name too short'}
      />
      <Input
        value={url}
        label="Url"
        placeholder="Url"
        onChangeText={setUrl}
        textContentType="URL"
        style={{ marginBottom: 10 }}
        status={urlValid ? 'primary' : 'danger'}
        onBlur={() => setUrlValid(validator.isURL(url) && validateEshopUrl(url))}
        caption={urlValid ? null : 'Must be an eshop-prices.com url (with currency=CLP)'}
      />
      <Button onPress={onFinish} disabled={!validateAll()} style={{ width: "100%" }}>
        {isLoading ? <Spinner status="success" /> : "Submit"}
      </Button>
      <Divider style={{ marginVertical: 10 }} />
      <List
        style={{ width: "100%", marginBottom: 100 }}
        data={requests}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={!loading && <Text>There are no requests!</Text>}
        onRefresh={() => onRefresh(1)}
        refreshing={loading}
      />
    </BaseLayout>
  )
}

export default CreateWatchlist
