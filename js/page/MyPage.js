

import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action';
import NavigationBar from '../common/NavigationBar'
import {MORE_MENU} from "../common/MORE_MENU";
import Ionicons from 'react-native-vector-icons/Ionicons'
import GlobalStyles from "../res/styles/GlobalStyles";
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

const THEME_COLOR = '#678'
type Props = {};
class MyPage extends Component<Props> {
  onClick(menu) {
    let RouteName, params = {}
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage'
        params.title = '教程'
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=304'
        break
      case MORE_MENU.About:
        RouteName = 'AboutPage'
        break
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage'
        params.isRemoveKey = menu === MORE_MENU.Remove_Key
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
        break
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        break
      case MORE_MENU.Sort_Key:
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage'
        params.flag = menu !== MORE_MENU.Sort_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
        break
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName)
    }
  }
  getItem(menu) {
    return ViewUtil.getMenuItem(() => {
      this.onClick(menu)
    }, menu, THEME_COLOR)
  }
  render() {
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar =  <NavigationBar
      title={'我的'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity onPress={() => this.onClick(MORE_MENU.About)} style={styles.item}>
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{
                  marginRight: 10,
                  color: THEME_COLOR
                }}
              ></Ionicons>
              <Text>Github Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                color: THEME_COLOR,
                alignSelf: 'center'
              }}
            ></Ionicons>
          </TouchableOpacity>
          <View style={GlobalStyles.line}></View>
          {this.getItem(MORE_MENU.Tutorial)}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {this.getItem(MORE_MENU.Custom_Language)}
          <View style={GlobalStyles.line}></View>
          {this.getItem(MORE_MENU.Sort_Language)}
          <Text style={styles.groupTitle}>最热管理</Text>
          {this.getItem(MORE_MENU.Custom_Key)}
          <View style={GlobalStyles.line}></View>
          {this.getItem(MORE_MENU.Sort_Key)}
          <View style={GlobalStyles.line}></View>
          {this.getItem(MORE_MENU.Remove_Key)}
          <Text style={styles.groupTitle}>设置</Text>
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line}></View>
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}></View>
          {this.getItem(MORE_MENU.Feedback)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  groupTitle: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }
});

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
