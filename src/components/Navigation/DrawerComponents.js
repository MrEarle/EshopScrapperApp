import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { View } from 'react-native'
import { Divider, Drawer, IndexPath, Text, DrawerItem } from '@ui-kitten/components'
import api from '../../api'

export const Header = (props) => {
  const email = useSelector((state) => state.user.email)
  return (
    <View
      style={[
        props.style,
        {
          height: 128,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#222B45',
        },
      ]}
    >
      <Text>{email || 'Eshop Scrapper'}</Text>
      <Divider />
    </View>
  )
}

Header.propTypes = {
  style: PropTypes.any,
}

export const CustomDrawerContent = ({
  isAuthed = false,
  navigation,
  state,
  routes,
}) => {
  return (
    <Drawer
      header={Header}
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) =>
        navigation.navigate(state.routeNames[index.row] || 'Home')
      }
    >
      {routes.map(({ label }) => (
        <DrawerItem title={label} key={label} />
      ))}
      {isAuthed && <DrawerItem title="Sign Out" onPress={() => api.logout()} />}
    </Drawer>
  )
}

CustomDrawerContent.propTypes = {
  isAuthed: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  state: PropTypes.shape({
    index: PropTypes.any.isRequired,
    routeNames: PropTypes.any.isRequired,
  }).isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
}
