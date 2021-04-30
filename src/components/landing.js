import { Text } from '@ui-kitten/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from '@react-navigation/native'
import BaseLayout from './Navigation/AppHome'

const Landing = () => {
  const authed = useSelector(({ user }) => user.token)
  return (
    <BaseLayout>
      <Text category="h1">Welcome to Eshop Scrapper!</Text>
      { authed ? (
        <Text category="s1"><Link to='/Watchlist'>Browse available games</Link> or <Link to='/Subscriptions'>manage your subscriptions</Link> to start getting notification when your favourite games become affordable!</Text>
      ) : (
        <Text category="s1"><Link to='/Log In'>Log In</Link> or <Link to='/Sign Up'>Sign Up</Link> to start getting notification when your favourite games become affordable!</Text>
      )
      }
    </BaseLayout>
  )
}

export default Landing