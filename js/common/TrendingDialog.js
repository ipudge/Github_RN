import React, {Component} from 'react'
import {Modal, TouchableOpacity, StyleSheet, View, Text, DeviceInfo} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TimeSpan from '../model/TimeSpan'

export const TimeSpans = [new TimeSpan('今天', 'since=daily'), new TimeSpan('本周', 'since=weekly'), new TimeSpan('本月', 'since=monthly')]

export default class TrendingDialog extends Component {
  state = {
    visible: false
  }

  show() {
    this.setState({
      visible: true
    })
  }

  dismiss() {
    this.setState({
      visible: false
    })
  }

  render() {
    const {onClose, onSelect} = this.props
    return (<Modal
        visible={this.state.visible}
        transparent={true}
        onRequestClose={() => onClose()}
      >
        <TouchableOpacity
          onPress={() => this.dismiss()}
          style={styles.container}
        >
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrowDown}
          ></MaterialIcons>
          <View style={styles.content}>
            {
              TimeSpans.map((e, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => onSelect(e)}
                    underlayColor={'transparent'}
                  >
                    <View style={styles.textContainer}>
                      <Text style={styles.text}>
                        {e.showText}
                      </Text>
                    </View>
                    {
                      i !== TimeSpans.length -1 ? <View
                        style={styles.line}
                      /> : null
                    }
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    alignItems: 'center',
    paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
  arrowDown: {
    marginTop: 40,
    color: '#fff',
    padding: 0,
    margin: -15
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26
  },
  line: {
    height: 0.3,
    backgroundColor: 'rgba(0 ,0 , 0, 0.3)'
  }
})
