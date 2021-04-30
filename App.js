import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Spinner, Text } from '@ui-kitten/components';
import store from './src/redux/store'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import Navigator from './src/components/Navigation'
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as theme } from './src/components/custom-theme.json'
import Entry from './src/components';

const persistor = persistStore(store)

export default function App() {
  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <PersistGate loading={<Spinner />} persistor={persistor}>
          <Entry />
          <StatusBar barStyle="light-content" />
        </PersistGate>
      </ApplicationProvider>
    </Provider >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
