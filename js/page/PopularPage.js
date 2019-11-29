import React, {Component} from 'react';
import {StyleSheet, Text, View, DeviceInfo, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import actions from '../action'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import EventBus from 'react-native-event-bus'
import PopularItem from '../common/PopularItem'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from "../navigator/NavigationUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventTypes from "../util/EventTypes";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_SORT = '&sort=star'
const THEME_COLOR = '#678'

type Props = {};

class PopularPage extends Component<Props> {
  constructor(props) {
    super(props)
    const {onLoadLanguage} = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_key)
  }

  _renderTabs() {
    const tabs = {}
    const {keys} = this.props
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab_${index}`] = {
          screen: props => <PopularTabPage tabLabel={item.name} {...props}/>,
          navigationOptions: {
            tabBarLabel: item.name
          }
        }
      }
    })
    return tabs
  }

  render() {
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />
    const {keys} = this.props
    const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(this._renderTabs(), {
      tabBarOptions: {
        tabStyle: {
          padding: 0
        },
        upperCaseLabel: false,//是否使标签大写，默认为true,
        scrollEnabled: true,//是否支持 选项卡滚动，默认false
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
    })) : null
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
        {navigationBar}
        {TabNavigator && <TabNavigator/>}
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)

const pageSize = 10

class PopularTab extends Component<Props> {
  constructor(props) {
    super(props)
    const {tabLabel} = this.props
    this.storeName = tabLabel
    this.isFavoriteChanged = false
  }

  genFetchUrl(url) {
    return URL + url + QUERY_SORT
  }

  componentDidMount() {
    this.loadData()
    EventBus.getInstance().addListener(EventTypes.BOTTOM_TAB_SELECT, this.bottomTabSelectListener = (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true)
      }
    })
    EventBus.getInstance().addListener(EventTypes.FAVORITE_CHANGE_POPULAR, this.favoriteChangePopularListener = () => {
      this.isFavoriteChanged = true
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
    EventBus.getInstance().removeListener(this.favoriteChangePopularListener)
  }

  _renderItem(data) {
    const item = data.item
    return <PopularItem
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />
  }

  _store() {
    const {popular} = this.props
    let store = popular[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
        hideLoadingMore: true,//默认隐藏加载更多
      }
    }
    return store
  }

  loadData(loadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props
    const store = this._store()
    const url = this.genFetchUrl(this.storeName)
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (msg) => {
        this.refs.toast.show(msg)
      })
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao, () => {
        this.isFavoriteChanged = false
      });
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }
  }

  genIndicator() {
    return this._store().hideLoadingMore ? null : <View style={styles.indicatorContainer}>
      <ActivityIndicator
        color={'red'}
        size={'large'}
        animating={true}
      />
      <Text>加载更多</Text>
    </View>
  }

  render() {
    const store = this._store()
    return (
      <View style={styles.container}>
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
              onRefresh={() => this.loadData()}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true)
                this.canLoadMore = false
              }
            }, 100)
          }}
          onScrollBeginDrag={() => {
            this.canLoadMore = true
          }}
          onEndReachedThreshold={0.5}
          keyExtractor={(item, index) => `key_${item.item.id}}`}
        />
        <Toast ref={'toast'} position={'center'}/>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  popular: state.popular
})

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback)),
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  indicatorContainer: {
    alignItems: 'center'
  },
});
