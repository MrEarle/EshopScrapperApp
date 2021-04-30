import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { View } from 'react-native'
import {
  Input,
  Text,
  Button,
  Icon,
  Popover,
  Spinner,
} from '@ui-kitten/components'
import validator from 'validator'

export const RenderCurrentPrice = ({ currentPrice, priceUpdatedAt }) => {
  const today = moment().format('YYYY-MM-DD')
  const [visible, setVisible] = React.useState(false)

  const renderWarning = () => {
    return (
      <Icon
        name="alert-triangle-outline"
        style={{ width: 20, height: 20 }}
        fill="#ff7700"
        onPress={() => setVisible(true)}
      />
    )
  }

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginRight: 10 }}>Current Price:</Text>
        <Text>{currentPrice ? `CLP $${currentPrice}` : '-'}</Text>
      </View>
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <Text strong style={{ marginRight: 10 }}>
          Updated At:
        </Text>
        <Text style={{ marginRight: 10 }}>{priceUpdatedAt}</Text>
        {today !== priceUpdatedAt && (
          <Popover
            anchor={renderWarning}
            visible={visible}
            onBackdropPress={() => setVisible(false)}
          >
            <Text
              style={{
                paddingHorizontal: 4,
                paddingVertical: 8,
                borderColor: '#ff7700',
                borderWidth: 2,
              }}
            >
              This price was not updated today!
            </Text>
          </Popover>
        )}
      </View>
    </View>
  )
}

RenderCurrentPrice.propTypes = {
  currentPrice: PropTypes.number,
  priceUpdatedAt: PropTypes.any,
}

const RenderSubscribe = ({ onSubscribe }) => {
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(false)

  const onPress = async () => {
    setLoading(true)
    await onSubscribe(maxPrice)
    setLoading(false)
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
      }}
    >
      <Input
        // prefix={<DollarOutlined />}
        keyboardType="decimal-pad"
        placeholder="Max. Price"
        value={maxPrice}
        onChangeText={(e) => setMaxPrice(e)}
        onKeyPress={({ nativeEvent }) =>
          nativeEvent.key === 'Enter' && maxPrice > 0 && onSubscribe(maxPrice)
        }
        style={{ marginRight: 5, flex: 1 }}
      />
      <Button
        onPress={onPress}
        disabled={!validator.isInt(maxPrice) && +maxPrice <= 0}
        style={{ flex: 1, marginLeft: 5 }}
      >
        {loading ? <Spinner status="success" /> : 'Subscribe'}
      </Button>
    </View>
  )
}

RenderSubscribe.propTypes = {
  onSubscribe: PropTypes.func.isRequired,
}

export const RenderUnsubscribe = ({ onUnsubscribe }) => {
  const [loading, setLoading] = useState(false)

  const onPress = async () => {
    setLoading(true)
    await onUnsubscribe()
    setLoading(false)
  }

  return (
    <Button
      status="danger"
      appearance="outline"
      onPress={onPress}
      style={{ marginTop: 15 }}
    >
      {loading ? <Spinner status="success" /> : 'Unsubscribe'}
    </Button>
  )
}

RenderUnsubscribe.propTypes = {
  onUnsubscribe: PropTypes.func.isRequired,
}

export default RenderSubscribe
