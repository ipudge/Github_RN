

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
  'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

type Props = {};
export default class FetchDemo extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    }
  }
  handleSearch() {
    const url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        this.setState({
          showText: responseText
        })
      })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FetchDemo</Text>
        <View style={styles.input_container}>
          <TextInput onChangeText={(text) => {
            this.searchKey = text
          }} style={styles.input}></TextInput>
          <Button title={'search'} onPress={() => {
            this.handleSearch()
          }}></Button>
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 30,
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
