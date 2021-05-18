import { Text } from '@ui-kitten/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from '@react-navigation/native'
import BaseLayout from './Navigation/AppHome'
import { StyleSheet, View } from 'react-native'

const Landing = () => {
  const authed = useSelector(({ user }) => user.token)
  return (
    <BaseLayout>
      <View style={{ height: '100%', justifyContent: 'space-evenly' }}>
        <Text category="h1">Welcome to Eshop Scrapper!</Text>
        <View>
          {authed ? (
            <Text category="h4">
              <Link style={styles.link} to="/Games">
                Browse available games
              </Link>{' '}
              or{' '}
              <Link style={styles.link} to="/Subscriptions">
                manage your subscriptions
              </Link>{' '}
              to start getting notifications when your favorite games become
              affordable!
            </Text>
          ) : (
            <Text category="h4">
              <Link style={styles.link} to="/Log In">
                Log In
              </Link>{' '}
              or{' '}
              <Link style={styles.link} to="/Sign Up">
                Sign Up
              </Link>{' '}
              to start getting notification when your favourite games become
              affordable!
            </Text>
          )}
        </View>
      </View>
    </BaseLayout>
  )
}

export default Landing

const styles = StyleSheet.create({
  link: {
    color: '#ff7700',
    textDecorationLine: 'underline',
  },
})
