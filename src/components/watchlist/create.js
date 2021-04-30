import {
  Input,
  Button,
  Text,
  Spinner,
  Divider,
  List,
  ListItem,
} from '@ui-kitten/components'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Alert } from 'react-native'
import validator from 'validator'
import api from '../../api'
import BaseLayout from '../Navigation/AppHome'
import RequestItem from './requestItem'
import { validateEshopUrl, getPaginatedFetch } from '../../api/helper'

const fetchRequests = getPaginatedFetch('authed/request')

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

  const onFinish = async () => {
    setIsLoading(true)
    try {
      const resp = await api
        .post('authed/watchlist', {
          name,
          url,
        })
        .then((r) => r.json())
      if (!resp || resp.status !== 200) throw new Error(resp ? resp.error : '')
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
        onBlur={() =>
          setUrlValid(validator.isURL(url) && validateEshopUrl(url))
        }
        caption={
          urlValid
            ? null
            : 'Must be an eshop-prices.com url (with currency=CLP)'
        }
      />
      <Button
        onPress={onFinish}
        disabled={!validateAll()}
        style={{ width: '100%' }}
      >
        {isLoading ? <Spinner status="success" /> : 'Submit'}
      </Button>
      <Divider style={{ marginVertical: 10 }} />
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
      />
    </BaseLayout>
  )
}

export default CreateWatchlist
