import { Text } from '@ui-kitten/components'
import React from 'react'
import PropTypes from 'prop-types'
import { Linking, View } from 'react-native'

const About = (props) => (
  <View style={[props.style, {
    backgroundColor: '#222B45'
  }]}>
    <Text>
      Eshop Scrapper created by Benjamin Earle -- Icons made by{' '}
      <Text
        style={{ color: 'gray' }}
        onPress={() => Linking.openURL('https://www.freepik.com')}
      >
        Freepik
      </Text>{' '}
      from{' '}
      <Text
        style={{ color: 'gray' }}
        onPress={() => Linking.openURL('https://www.flaticon.com/')}
      >
        www.flaticon.com
      </Text>
    </Text>
  </View>
)

About.propTypes = {
  style: PropTypes.any
}

export default About
