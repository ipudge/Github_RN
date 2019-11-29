

import React, {Component} from 'react';
import {StyleSheet, View, DeviceInfo, FlatList, RefreshControl} from 'react-native';
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import EventBus from 'react-native-event-bus'
import actions from '../action'
import PopularItem from '../common/PopularItem'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventTypes from "../util/EventTypes";
const THEME_COLOR = '#678'

type Props = {};
export default class FavoritePage extends Component<Props> {
  constructor(props) {
    super(props)
  }
  render() {
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar =  <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
      'Popular': {
        screen: props => <FavoriteTabPage flag={FLAG_STORAGE.flag_popular} {...props}/>,
        navigationOptions: {
          tabBarLabel: '最热'
        }
      },
      'Trending': {
        screen: props => <FavoriteTabPage flag={FLAG_STORAGE.flag_trending} {...props}/>,
        navigationOptions: {
          tabBarLabel: '趋势'
        }
      }
    }, {
      tabBarOptions: {
        tabStyle: {
          padding: 0
        },
        upperCaseLabel: false,//是否使标签大写，默认为true,
        style: {
          backgroundColor: '#678',//TabBar 的背景颜色
          height: 30
        },
        indicatorStyle: {
          height: 2,
          backgroundColor: 'white',
        },//标签指示器的样式
        labelStyle: {
          fontSize: 13,
          margin: 0
        },//文字的样式
      },
      lazy: true
    }))
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
        {navigationBar}
        <TabNavigator/>
      </View>
    );
  }
}

class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props)
    const {flag} = this.props
    this.storeName = flag
    this.favoriteDao = new FavoriteDao(this.storeName)
  }
  componentDidMount() {
    this.loadData(true)
    EventBus.getInstance().addListener(EventTypes.BOTTOM_TAB_SELECT, this.bottomNavigationChangeListener = (data) => {
      if (data.to === 2) {
        this.loadData(false)
      }
    })
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.bottomNavigationChangeListener)
  }
  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName)
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.FAVORITE_CHANGE_POPULAR)
    } else {
      EventBus.getInstance().fireEvent(EventTypes.FAVORITE_CHANGE_TRENDING)
    }
  }
  _renderItem(data) {
    const item = data.item
    const FavoriteItem = this.storeName === FLAG_STORAGE.flag_trending ? TrendingItem : PopularItem
    return <FavoriteItem
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: this.storeName,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />
  }
  _store() {
    const {favorite} = this.props
    let store = favorite[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
      }
    }
    return store
  }
  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props
    onLoadFavoriteData(this.storeName, isShowLoading)
  }

  render() {
    const store = this._store()
    return (
      <View style={styles.container} >
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this._renderItem(data)}
          refreshControl={
            <RefreshControl
              title={'loading'}
              colors={['red']}
              tintColor={'orange'}
              titleColor={'red'}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
            />
          }
          keyExtractor={(item, index) => `key_${item.item.id || item.item.fullName}}`}
        />
        <Toast ref={'toast'} position={'center'}/>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  favorite: state.favorite
})

const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (flag, isShowLoading) => dispatch(actions.onLoadFavoriteData(flag, isShowLoading)),
})

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  indicatorContainer: {
    alignItems: 'center'
  },
});
