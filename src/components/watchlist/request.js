import { Input, Button, Text, Spinner } from '@ui-kitten/components'
import React from 'react'
import { useState } from 'react'
import { Alert } from 'react-native'
import validator from 'validator'
import api from '../../api'
import BaseLayout from '../Navigation/AppHome'

const validateEshopUrl = (url) => {
  const pattern = /^https:\/\/eshop-prices\.com\/games\/(\d+)-.+$/
  const match = pattern.exec(url)
  if (!match) return null
  return match && match[1]
}

const CreateGameRequest = () => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const [nameValid, setNameValid] = useState(true)
  const [urlValid, setUrlValid] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const validateAll = () => {
    return (
      name &&
      url &&
      validator.isLength(name, { min: 1 }) &&
      validator.isURL(url) &&
      validateEshopUrl(url)
    )
  }

  const onFinish = async () => {
    setIsLoading(true)
    try {
      const resp = await api.post('authed/request/', {
        name,
        url,
      }).then(r => r.json())
      if (!resp || resp.status !== 200) throw new Error()
      Alert.alert('Request successfully created!')
    } catch (err) {
      Alert.alert('There was an error creating the request')
    }
    setIsLoading(false)
  }

  return (
    <BaseLayout>
      <Text category="h5">Send a request for your favourite game!</Text>
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
    </BaseLayout>
  )
}

export default CreateGameRequest
