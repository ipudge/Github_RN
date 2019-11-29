import React, {Component} from 'react';
import {View, Linking, Clipboard} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-easy-toast'
import GlobalStyles from "../../res/styles/GlobalStyles";
import ViewUtil from "../../util/ViewUtil";
import NavigationUtil from "../../navigator/NavigationUtil";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import config from '../../res/data/config'

const THEME_COLOR = '#678'
type Props = {};
export default class AboutMePage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me
    }, data => this.setState({...data}))
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false
    }
  }
  onClick(item) {
    if (!item) return;
    if (item.url) {
      NavigationUtil.goPage({
        title: item.title,
        url: item.url
      }, 'WebViewPage');
      return;
    }
    if (item.account && item.account.indexOf('@') > -1) {
      let url = 'mailto://' + item.account;
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      }).catch(err => console.error('An error occurred', err));
      return;
    }
    if (item.account)  {
      Clipboard.setString(item.account);
      this.toast.show(item.title + item.account + '已复制到剪切板。');
    }
  }
  _item(data, isShow, key) {
    return ViewUtil.getSettingItem(() => {
      this.setState({
        [key]: !this.state[key]
      })
    }, data.name, THEME_COLOR, Ionicons, data.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down')
  }
  renderItems(dic, isShowAccount) {
    if (!dic) return null;
    const views = [];
    for (let i in dic) {
      const title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title)}
          <View style={GlobalStyles.line}/>
        </View>
      )
    }
    return views
  }
  render() {
    const content = <View>
      {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
      <View style={GlobalStyles.line}></View>
      {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

      {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
      <View style={GlobalStyles.line}/>
      {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

      {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
      <View style={GlobalStyles.line}/>
      {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}

      {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
      <View style={GlobalStyles.line}/>
      {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}
    </View>
    return <View style={{flex: 1}}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast ref={toast => this.toast = toast}
             position={'center'}
      />
    </View>
  }
}

