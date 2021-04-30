import { Input, Button, Spinner } from '@ui-kitten/components'
import React from 'react'
import { useState } from 'react'
import { Alert } from 'react-native'
import validator from 'validator'
import api from '../../api'
import BaseLayout from '../Navigation/AppHome'
import { validateEshopUrl } from '../../api/helper'

const CreateWatchlist = () => {
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
      const resp = await api
        .post('authed/watchlist', {
          name,
          url,
        })
        .then((r) => r.json())
      if (!resp || resp.status !== 200) throw new Error(resp ? resp.error : '')
      Alert.alert('Game successfully created!')
      setName('')
      setUrl('')
    } catch (err) {
      Alert.alert('There was an error creating the game')
    }
    setIsLoading(false)
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
    </BaseLayout>
  )
}

export default CreateWatchlist
