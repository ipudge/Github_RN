import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, DeviceInfo, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import actions from '../action'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog'
import NavigationUtil from "../navigator/NavigationUtil"
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
import ArrayUtil from "../util/ArrayUtil"
import FavoriteDao from "../expand/dao/FavoriteDao"
import {FLAG_STORAGE} from "../expand/dao/DataStore"
import FavoriteUtil from "../util/FavoriteUtil"
import EventTypes from "../util/EventTypes"
import EventBus from "react-native-event-bus"

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
const URL =  'https://github.com/trending/'
const THEME_COLOR = '#678'
const TIME_SPAN_CHANGE = 'timeSpanChange'

type Props = {};
class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      timeSpan: TimeSpans[0]
    }
    const {onLoadLanguage} = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_language)
    this.prevKeys = []
  }
  _renderTabs() {
    const tabs = {}
    const {keys} = this.props
    this.prevKeys = keys
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab_${index}`] = {
          screen: props => <TrendingTabPage tabLabel={item.name} {...props} timeSpan={this.state.timeSpan}/>,
          navigationOptions: {
            tabBarLabel: item.name
          }
        }
      }
    })
    return tabs
  }
  renderTitleView() {
    return <View>
      <TouchableOpacity
      underlayColor={'transparent'}
      onPress={() => this.dialog.show()}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{
            fontSize:18,
            color: '#fff',
            fontWeight: '400'
          }}>趋势 {this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color: '#fff'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  onSelectTimeSpan(tab) {
    this.dialog.dismiss()
    this.setState({
      timeSpan: tab
    })
    DeviceEventEmitter.emit(TIME_SPAN_CHANGE, tab)
  }
  renderTrendingDialog() {
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTimeSpan(tab)}
    ></TrendingDialog>
  }
  _tabNav() {
    if (!this.tabNav || !ArrayUtil.isEqual(this.prevKeys, this.props.keys)) {
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(this._renderTabs(), {
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
      }))
    }
    return this.tabNav
  }
  render() {
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar =  <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />
    const {keys} = this.props
    const TabNavigator = keys.length ? this._tabNav() : null
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
        {navigationBar}
        {TabNavigator && <TabNavigator/>}
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const mapTrendingStateToProps = state => ({
  keys: state.language.languages
})

const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage)

const pageSize = 10
class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props)
    const {tabLabel, timeSpan} = this.props
    this.storeName = tabLabel
    this.timeSpan = timeSpan
    this.isFavoriteChanged = false
  }
  genFetchUrl(url) {
    return URL + url + '?' + this.timeSpan.searchText
  }
  componentDidMount() {
    this.loadData()
    this.listener = DeviceEventEmitter.addListener(TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan
      this.loadData()
    })
    EventBus.getInstance().addListener(EventTypes.BOTTOM_TAB_SELECT, this.bottomTabSelectListener = (data) => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true)
      }
    })
    EventBus.getInstance().addListener(EventTypes.FAVORITE_CHANGE_POPULAR, this.favoriteChangePopularListener = () => {
      this.isFavoriteChanged = true
    })
  }
  componentWillUnmount() {
    this.listener && this.listener.remove()
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
    EventBus.getInstance().removeListener(this.favoriteChangePopularListener)
  }
  _renderItem(data) {
    const item = data.item
    return <TrendingItem
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
    />
  }
  _store() {
    const {trending} = this.props
    let store = trending[this.storeName]
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
    const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props
    const store = this._store()
    const url = this.genFetchUrl(this.storeName)
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (msg) => {
        this.refs.toast.show(msg)
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao, () => {
        this.isFavoriteChanged = false
      });
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
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
          keyExtractor={(item, index) => `key_${item.item.fullName}}`}
        />
        <Toast ref={'toast'} position={'center'}/>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  trending: state.trending
})

const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray, favoriteDao, callback)),
})

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  indicatorContainer: {
    alignItems: 'center'
  },
});
