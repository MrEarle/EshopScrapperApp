import React, { useState } from 'react'
import moment from "moment"
import { View } from 'react-native'
import { Input, Text, Button, Icon, Popover } from '@ui-kitten/components'
import validator from 'validator'

export const RenderCurrentPrice = ({ currentPrice, priceUpdatedAt }) => {
  const today = moment().format("YYYY-MM-DD")
  const [visible, setVisible] = React.useState(false);

  const renderWarning = () => {
    return <Icon
      name="alert-triangle-outline"
      style={{ width: 20, height: 20 }}
      fill="#ff7700"
      onPress={() => setVisible(true)}
    />
  }

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginRight: 10 }}>
          Current Price:
        </Text>
        <Text>
          CLP ${currentPrice}
        </Text>
      </View>
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <Text strong style={{ marginRight: 10 }}>
          Updated At:
        </Text>
        <Text style={{ marginRight: 10 }}>
          {priceUpdatedAt}
        </Text>
        {
          today !== priceUpdatedAt && (
            <Popover
              anchor={renderWarning}
              visible={visible}
              onBackdropPress={() => setVisible(false)}>
              <Text style={{ paddingHorizontal: 4, paddingVertical: 8, borderColor: "#ff7700", borderWidth: 2 }}>This price wasn't updated today!</Text>
            </Popover>
          )}
      </View>
    </View>
  )
}

const RenderSubscribe = ({ onSubscribe }) => {
  const [maxPrice, setMaxPrice] = useState('')
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 10
      }}>
      <Input
        // prefix={<DollarOutlined />}
        keyboardType="decimal-pad"
        placeholder="Max. Price"
        value={maxPrice}
        onChangeText={(e) => setMaxPrice(e)}
        onKeyPress={({ nativeEvent }) => nativeEvent.key === 'Enter' && maxPrice > 0 && onSubscribe(maxPrice)}
        style={{ marginRight: 5, flex: 1 }}
      />
      <Button onPress={() => onSubscribe(maxPrice)} disabled={!validator.isInt(maxPrice) && +maxPrice <= 0} style={{ flex: 1, marginLeft: 5 }}>
        Subscribe
      </Button>
    </View>
  )
}

export const RenderUnsubscribe = ({ onUnsubscribe }) => {
  return <Button
    status="danger"
    appearance="outline"
    onPress={onUnsubscribe}
    style={{ marginTop: 15 }}
  >
    Unubscribe
    </Button>
}

export default RenderSubscribe
