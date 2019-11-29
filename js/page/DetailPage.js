import React, {Component} from 'react';
import {StyleSheet, DeviceInfo, View, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from '../expand/dao/FavoriteDao'

const THEME_COLOR = '#678'
const TRENDING_URL = 'https://github.com/'

type Props = {};
export default class DetailPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const {flag, projectModel} = this.params
    const {item, isFavorite} = projectModel
    this.url = item.html_url || TRENDING_URL + item.fullName
    const title = item.full_name || item.fullName
    this.favoriteDao = new FavoriteDao(flag)
    this.state = {
      title,
      url: this.url,
      canGoBack: false,
      isFavorite
    }
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress() {
    this.onBack()
    return true
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onFavoriteButtonClick() {
    const {projectModel, callback} = this.params
    const {isFavorite, item} = projectModel
    const currentIsFavorite = !isFavorite
    callback(currentIsFavorite)
    this.setState({
      isFavorite: currentIsFavorite
    })
    let key = item.fullName || item.id.toString()
    if (currentIsFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
    } else {
      this.favoriteDao.removeFavoriteItem(key)
    }
  }

  renderRightButton() {
    return <View
      style={{flexDirection: 'row'}}
    >
      <TouchableOpacity
        onPress={() => {
          this.onFavoriteButtonClick()
        }}
      >
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={20}
          style={{
            color: '#fff',
            marginRight: 10
          }}
        />
      </TouchableOpacity>
      {ViewUtil.getShareButton(() => {

      })}
    </View>
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }

  render() {
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
    const navigationBar = <NavigationBar
      title={this.state.title}
      titleLayoutStyl e={titleLayoutStyle}
      leftButton={ViewUtil.getLeftBackButton(() => {
        this.onBack()
      })}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={this.renderRightButton()}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        ></WebView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  }
});
