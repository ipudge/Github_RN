import React, {Component} from 'react'
import {ViewPropTypes, StatusBar, View, Text, StyleSheet, Platform} from 'react-native'
import PropTypes from 'prop-types'

const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string
}

const NAV_BAR_HEIGHT_IOS = 44 // IOS
const NAV_BAR_HEIGHT_ANDROID = 50 // Android
const STATUS_BAR_HEIGHT = 20

export default class NavigationBar extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element
  }

  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false
    }
  }

  render() {
    const statusBar = !this.props.statusBar.hidden ? <View style={styles.statusBar}>
      <StatusBar {...this.props.statusBar}/>
    </View> : null

    const titleView = this.props.titleView ? this.props.titleView :
      <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.title}>{this.props.title}</Text>

    const content = this.props.hide ? null :
      <View style={styles.navBar}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>

    return <View style={[styles.container, this.props.style]}>
      {statusBar}
      {content}
    </View>
  }

  getButtonElement(data) {
    return <View style={styles.navBarButton}>
      {data || null}
    </View>
  }
}

const styles = StyleSheet.create({
  navBarButton: {
    alignItems: 'center'
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0
  },
  title: {
    fontSize: 20,
    color: 'white'
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0
  }
})
