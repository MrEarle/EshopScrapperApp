import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Layout, Text } from '@ui-kitten/components'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useNavigation, DrawerActions } from "@react-navigation/native"

const BaseLayout = ({ children }) => {
  const navigation = useNavigation()
  return (
    <SafeAreaView className={styles.layout}>
      <Layout style={styles.title} level="2">
        <Icon
          name="menu-outline"
          fill="whitesmoke"
          style={{ width: 30, height: 30, padding: 5 }}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
        <Text category="h3">Eshop Scrapper</Text>
      </Layout>
      <Layout style={styles.content} level="1">
        {children}
      </Layout>
    </SafeAreaView>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.node
}


export default BaseLayout


const styles = StyleSheet.create({
  layout: {
    flex: 1,
    height: "100%",
    width: '100%'
  },
  content: {
    margin: 0,
    padding: '5%',
    width: "100%",
    height: "90%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    height: "10%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 20
  }
})
