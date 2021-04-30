import { Text } from '@ui-kitten/components'
import React from 'react'
import { Linking } from 'react-native'
import BaseLayout from './Navigation/AppHome'

const About = () => (
  <BaseLayout>
    <Text>Eshop Scrapper created by Benjamin Earle -- Icons made by{' '}
      <Text style={{ color: 'gray' }} onPress={() => Linking.openURL("https://www.freepik.com")}>
        Freepik
      </Text>
      {' '}from{' '}
      <Text style={{ color: 'gray' }} onPress={() => Linking.openURL("https://www.flaticon.com/")}>
        www.flaticon.com
    </Text>
    </Text>
  </BaseLayout>
)

export default About