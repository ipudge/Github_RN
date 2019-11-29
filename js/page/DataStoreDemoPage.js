import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button} from 'react-native';
import DataStore from "../expand/dao/DataStore";

type Props = {};
export default class DataStoreDemoPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    }
    this.dataStore = new DataStore()
  }

  loadData() {
    const url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    this.dataStore.fetchData(url)
      .then((res) => {
        const showText = `初次加载时间${new Date(res.timestamp)}${JSON.stringify(res.data)}`
        this.setState({
          showText
        })
      })
      .catch((e) => {
        this.setState({
          showText: e.toString()
        })
      })

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>DataStoreDemoPage</Text>
        <View style={styles.input_container}>
          <TextInput onChangeText={(text) => {
            this.searchKey = text
          }} style={styles.input}></TextInput>
          <Button title={'search'} onPress={() => {
            this.loadData()
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
