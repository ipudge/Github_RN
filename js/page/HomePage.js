import React, {Component} from 'react';
import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import {connect} from "react-redux";
import {NavigationActions} from 'react-navigation'
import BackPressComponent from "../common/BackPressComponent";



type Props = {};
class HomePage extends Component<Props> {
  constructor(props) {
    super(props)
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
  }
  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress() {
    const {dispatch, nav} = this.props

    if(nav.routes[1].index === 0) {
      return false
    }
    dispatch(NavigationActions.back())
    return true
  }
  render() {
    NavigationUtil.navigation = this.props.navigation
    return (
      <DynamicTabNavigator/>
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect(mapStateToProps)(HomePage);

