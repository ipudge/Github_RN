import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import BaseItem from "./BaseItem";

export default class PopularItem extends BaseItem {
  render() {
    const {item} = this.props.projectModel
    if (!item && !item.owner) return null
    return (
      <TouchableOpacity
        onPress={() => this.onItemClick()}
      >
        <View style={styles.item_wrapper}>
          <Text style={styles.title}>{item.full_name}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Author:</Text>
              <Image style={{height: 22, width: 22}}
                     source={{uri: item.owner.avatar_url}}
              />
            </View>
            <View style={styles.row}>
              <Text>Start:</Text>
              <Text>{item.stargazers_count}</Text>
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
