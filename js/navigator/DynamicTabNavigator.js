import React, {Component} from 'react';
import {
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation'
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {BottomTabBar} from 'react-navigation-tabs'
import EventBus from 'react-native-event-bus'

import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import PopularPage from '../page/PopularPage'
import EventTypes from '../util/EventTypes'

const TABS = {
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          size={26}
          name={'whatshot'}
          style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons
          size={26}
          name={'md-trending-up'}
          style={{color: tintColor}}
        />
      )
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '喜欢',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          size={26}
          name={'favorite'}
          style={{color: tintColor}}
        />
      )
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({tintColor, focused}) => (
        <FontAwesome
          size={26}
          name={'user'}
          style={{color: tintColor}}
        />
      )
    }
  }
}
type Props = {};
class DynamicTabNavigator extends Component<Props> {
  constructor(props) {
    super(props)
  }

  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs;
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};//根据需要定制显示的tab
    PopularPage.navigationOptions.tabBarLabel = '最热';//动态配置Tab属性
    return this.Tabs = createAppContainer(createBottomTabNavigator(tabs, {
        tabBarComponent: props => {
          return <TabBarComponent theme={this.props.theme} {...props}/>
        }
      }
    ))
  }

  render() {
    const Tab = this._tabNavigator()
    return (
      <Tab onNavigationStateChange={(prevState, nextState, action) => {
        EventBus.getInstance().fireEvent(EventTypes.BOTTOM_TAB_SELECT, {
          from: prevState.index,
          to: nextState.index,
        })
      }}/>
    );
  }
}

class TabBarComponent extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.props.theme}
    />
  }
}


const mapStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);
