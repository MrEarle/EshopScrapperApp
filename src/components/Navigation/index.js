import React from 'react'
import { useSelector } from 'react-redux'
import getRoutes from '../routes'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import api from '../../api';
import { Divider, Drawer, DrawerItem, IndexPath, Text } from '@ui-kitten/components';
import { View } from 'react-native';

const { Navigator, Screen } = createDrawerNavigator()

const Header = (props) => {
  const email = useSelector(state => state.user.email)
  return (
    <View style={[
      props.style,
      {
        height: 128,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#222B45"
      }
    ]}>
      <Text>{email || "Eshop Scrapper"}</Text>
      <Divider />
    </View>
  )
}

const CustomDrawerContent = ({ isAuthed, navigation, state, routes }) => {
  return (
    <Drawer
      header={Header}
      selectedIndex={new IndexPath(state.index)}
      onSelect={index => navigation.navigate(state.routeNames[index.row] || "Home")}
    >
      {routes.map(({ label }) => <DrawerItem title={label} key={label} />)}
      {isAuthed && <DrawerItem title="Sign Out" onPress={() => api.logout()} />}
    </Drawer>
  )
}

const AppNavigator = () => {
  const isAuthed = useSelector((state) => !!state.user.token)
  const isAdmin = useSelector((state) => state.user.isAdmin)

  const renderScreen = ({ label, Renderer }, i) => {
    return <Screen
      name={label}
      component={Renderer}
      key={`${i}-${label}`}
    />
  }

  const routes = [
    ...getRoutes('permanent'),
    ...(isAuthed ? getRoutes('authed') : getRoutes('free')),
    ...(isAdmin ? getRoutes('admin') : [])
  ]

  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} isAuthed={isAuthed} routes={routes} />}
        lazy
      >
        {routes.map(renderScreen)}
      </Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
