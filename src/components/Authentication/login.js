import React, { useState } from 'react'
import PropTypes from 'prop-types'
import api from '../../api'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/reducers/user'
import { Alert, StyleSheet } from 'react-native'
import BaseLayout from '../Navigation/AppHome'
import { Input, Button, Spinner } from '@ui-kitten/components'
import validator from 'validator'

const Login = ({ navigation }) => {
  const deviceToken = useSelector((state) => state.appState.expoToken)
  const dispatch = useDispatch()
  // const device = useSelector((state) => state.fcm.token)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const validateAll = () => {
    return (
      email &&
      password &&
      validator.isEmail(email) &&
      validator.isLength(password, { min: 6 })
    )
  }

  const onFinish = async () => {
    setIsLoading(true)
    try {
      const { token, isAdmin, refreshToken } = await api.logIn({
        email,
        password,
        device: deviceToken,
      })
      if (!token) return false
      dispatch(userActions.setToken(token))
      dispatch(userActions.setIsAdmin(isAdmin))
      dispatch(userActions.setRefreshToken(refreshToken))
      navigation.navigate('Watchlist')
    } catch (err) {
      Alert.alert('Incorrect email or password')
    }
    setIsLoading(false)
  }

  return (
    <BaseLayout>
      <Input
        value={email}
        label="Email"
        placeholder="Email"
        onChangeText={setEmail}
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        style={styles.input}
        status={emailValid ? 'primary' : 'danger'}
        onBlur={() => setEmailValid(validator.isEmail(email))}
        caption={emailValid ? null : 'Invalid Email'}
      />
      <Input
        value={password}
        label="Password"
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        status={passwordValid ? 'primary' : 'danger'}
        onBlur={() =>
          setPasswordValid(validator.isLength(password, { min: 6 }))
        }
        caption={passwordValid ? null : 'Password is too short'}
      />
      <Button onPress={onFinish} disabled={!validateAll()}>
        {isLoading ? <Spinner status="success" /> : 'Submit'}
      </Button>
    </BaseLayout>
  )
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
}

export default Login

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
})
