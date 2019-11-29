import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview'
import BaseItem from "./BaseItem";

export default class TrendingItem extends BaseItem {
  render() {
    const {item} = this.props.projectModel
    if (!item && !item.owner) return null
    return (
      <TouchableOpacity
        onPress={() => this.onItemClick()}
      >
        <View style={styles.item_wrapper}>
          <Text style={styles.title}>{item.full_name}</Text>
          <View style={styles.desc}>
            <HTMLView
              value={item.description}
              onLinkPress={() => {}}
              stylesheet={{
                a: styles.description,
                p: styles.description
              }}
            />
          </View>
          <Text style={styles.desc}>{item.meta}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Build by:</Text>
              {
                item.contributors.map((e, i) => {
                  return <Image
                    key={i}
                    style={{height: 22, width: 22, margin: 2}}
                                source={{uri: e}}
                  />
                })
              }
            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  item_wrapper: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2 //android阴影
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  desc: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
})
