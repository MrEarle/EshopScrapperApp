import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import registerForPushNotificationsAsync from '../notifications'
import { appStateActions } from '../redux/reducers/appState'
import AppNavigator from './Navigation'

const Entry = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    registerForPushNotificationsAsync().then((expoToken) =>
      dispatch(appStateActions.setExpoToken(expoToken))
    )
  }, [])

  return <AppNavigator />
}

export default Entry
