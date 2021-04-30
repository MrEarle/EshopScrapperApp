import React, { useState } from 'react'
import api from '../../api'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/reducers/user'
import { Alert, StyleSheet } from 'react-native'
import { Button, Input, Spinner } from '@ui-kitten/components'
import BaseLayout from '../Navigation/AppHome'
import validator from 'validator'


const SignUp = ({ navigation }) => {
  const deviceToken = useSelector(state => state.appState.deviceToken)
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const [emailValid, setEmailValid] = useState(true)
  const [usernameValid, setUsernameValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)
  const [password2Valid, setPassword2Valid] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const validateAll = () => {
    return (
      email &&
      username &&
      password &&
      password2 &&
      validator.isEmail(email) &&
      validator.isLength(username, { min: 4 }) &&
      validator.isLength(password, { min: 6 }) &&
      validator.equals(password, password2)
    )
  }

  const onFinish = async () => {
    setIsLoading(true)
    if (password !== password2) {
      message.alert('Passwords don\'t match!')
      return
    }

    try {
      const { token, refreshToken, isAdmin } = await api.register({
        email,
        password,
        password2,
        username,
        device: deviceToken
      })
      if (!token) return false
      dispatch(userActions.setToken(token))
      dispatch(userActions.setIsAdmin(isAdmin))
      dispatch(userActions.setRefreshToken(refreshToken))
      navigation.navigate('Watchlist')
    } catch (err) {
      Alert.alert('There was an error signing up')
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
        value={username}
        label="Username"
        placeholder="Username"
        onChangeText={setUsername}
        style={styles.input}
        status={usernameValid ? 'primary' : 'danger'}
        onBlur={() => setUsernameValid(validator.isLength(username, { min: 4 }))}
        caption={usernameValid ? null : 'Username too short'}
      />
      <Input
        value={password}
        label="Password"
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        status={passwordValid ? 'primary' : 'danger'}
        onBlur={() => setPasswordValid(validator.isLength(password, { min: 6 }))}
        caption={passwordValid ? null : 'Password is too short'}
      />
      <Input
        value={password2}
        label="Confirm Password"
        placeholder="Password"
        onChangeText={setPassword2}
        secureTextEntry
        style={styles.input}
        status={password2Valid ? 'primary' : 'danger'}
        onBlur={() => setPassword2Valid(validator.equals(password, password2))}
        caption={password2Valid ? null : 'Password does not match'}
      />
      <Button onPress={onFinish} disabled={!validateAll()}>
        {isLoading ? <Spinner status="success" /> : "Submit"}
      </Button>
    </BaseLayout>
  )
}

export default SignUp

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  }
})
