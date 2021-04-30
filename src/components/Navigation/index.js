import React from 'react'
import { useSelector } from 'react-redux'
import getRoutes from '../routes'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { CustomDrawerContent } from './DrawerComponents'

const { Navigator, Screen } = createDrawerNavigator()

const AppNavigator = () => {
  const isAuthed = useSelector((state) => !!state.user.token)
  const isAdmin = useSelector((state) => state.user.isAdmin)

  const renderScreen = ({ label, Renderer }, i) => {
    return <Screen name={label} component={Renderer} key={`${i}-${label}`} />
  }

  const routes = [
    ...getRoutes('permanent'),
    ...(isAuthed ? getRoutes('authed') : getRoutes('free')),
    ...(isAdmin ? getRoutes('admin') : []),
  ]

  return (
    <NavigationContainer>
      <Navigator
        initialRouteName="Home"
        drawerContent={(props) => (
          <CustomDrawerContent {...props} isAuthed={isAuthed} routes={routes} />
        )}
        lazy
      >
        {routes.map(renderScreen)}
      </Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
