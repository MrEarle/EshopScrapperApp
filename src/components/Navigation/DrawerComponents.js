import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { View } from 'react-native'
import { Divider, Drawer, IndexPath, Text, DrawerItem, Icon } from '@ui-kitten/components'
import api from '../../api'
import About from '../About'

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
      {email && <Icon name="person-outline" style={{ height: 30, width: 30, marginRight: 5 }} fill="whitesmoke" />}
      <Text>
        {email || 'Eshop Scrapper'}
      </Text>
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
  const nonAdmin = routes.filter(({ type }) => type !== 'Admin')
  const admin = routes.filter(({ type }) => type === 'Admin')
  const [index, setIndex] = useState(new IndexPath(0))

  const onSelectItem = (index) => {
    let routeIndex = index.row
    if (index.row >= nonAdmin.length) {
      routeIndex -= 1
    }
    setIndex(index)
    navigation.navigate(state.routeNames[routeIndex] || 'Home')
  }

  const getRenderIcon = (name) => {
    const RenderIcon = (props) => (
      <Icon name={name} {...props} />
    )
    return RenderIcon
  }

  return (
    <Drawer
      header={Header}
      selectedIndex={index}
      onSelect={onSelectItem}
      footer={About}
    >
      {nonAdmin.map(({ label, icon }) => (
        <DrawerItem title={label} key={label} accessoryLeft={getRenderIcon(icon)} />
      ))}
      <Divider />
      {admin.map(({ label, icon }) => (
        <DrawerItem title={label} key={label} accessoryLeft={getRenderIcon(icon)} />
      ))}
      <Divider />
      {isAuthed && <DrawerItem title="Sign Out" onPress={() => api.logout()} accessoryLeft={getRenderIcon('log-out-outline')} />}
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
