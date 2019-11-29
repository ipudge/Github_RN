import React from 'react'
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {
  static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
    return (
      <TouchableOpacity
        onPress={callback}
        style={styles.setting_item_container}
      >
        <View style={{
          alignItems: 'center',
          flexDirection: 'row'
        }}>
          {Icons && icon ?
            <Icons
              name={icon}
              size={16}
              style={{
                color,
                marginRight: 10
              }}
            /> : <View
              style={{width: 16, height: 16, marginRight: 10, color, opacity: 1}}
            ></View>
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIco ? expandableIco : 'ios-arrow-forward'}
          size={16}
          style={{
            marginRight: 10,
            color: color || '#000',
            alignSelf: 'center'
          }}
        ></Ionicons>
      </TouchableOpacity>
    )
  }
  static getMenuItem(callback, menu, color, expandableIco) {
    return ViewUtil.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIco)
  }
  static getTextButton(title, cb) {
    return <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={cb}
    >
      <Text style={{fontSize:20, color: '#fff',marginRight: 10}}>{title}</Text>
    </TouchableOpacity>
  }
  static getLeftBackButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8, paddingLeft: 12}}
      onPress={callBack}
    >
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color: '#fff'}}
      />
    </TouchableOpacity>
  }

  static getShareButton(callBack) {
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={callBack}
    >
      <Ionicons
        name={'md-share'}
        size={20}
        style={{color: '#fff', opacity: 0.9, marginRight: 10}}
      />
    </TouchableOpacity>
  }
}


const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: '#fff',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});
