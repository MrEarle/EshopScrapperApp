import { Input, Spinner, Button } from '@ui-kitten/components'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Alert, View } from 'react-native'
import validator from 'validator'
import api from '../../api'

const validateEshopUrl = (url) => {
  const pattern = /^https:\/\/eshop-prices\.com\/games\/(\d+)-.+$/
  const match = pattern.exec(url)
  if (!match) return null
  return match && match[1]
}

const RequestItem = ({ request, onSubmit }) => {
  const [name, setName] = useState(request.name)
  const [url, setUrl] = useState(request.url)
  const [edit, setEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [nameValid, setNameValid] = useState(true)
  const [urlValid, setUrlValid] = useState(true)

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
        .post(`authed/request/approve/${request.id}`, {
          name,
          url,
        })
        .then((r) => r.json())
      if (!resp || resp.status !== 200) {
        throw new Error()
      }
      Alert.alert('Game successfully created!')
      onSubmit()
    } catch (err) {
      Alert.alert('There was an error creating the game')
    }
    setIsLoading(false)
  }

  return (
    <View style={{ width: '100%' }}>
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
        disabled={!edit}
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
        disabled={!edit}
      />
      <Button
        onPress={() => setEdit((edit) => !edit)}
        style={{ marginBottom: 10 }}
      >
        {!edit ? 'Edit' : 'Stop Editing'}
      </Button>
      <Button disabled={!validateAll()} onPress={onFinish}>
        {isLoading ? <Spinner status="success" /> : 'Approve'}
      </Button>
    </View>
  )
}

RequestItem.propTypes = {
  request: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    id: PropTypes.any.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default RequestItem
