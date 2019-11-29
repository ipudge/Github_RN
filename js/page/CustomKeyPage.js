import React, {Component} from 'react';
import {StyleSheet, Alert, View, DeviceInfo, ScrollView} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action'
import NavigationBar from '../common/NavigationBar'
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'
import GlobalStyles from "../res/styles/GlobalStyles";
import NavigationUtil from "../navigator/NavigationUtil";
import ArrayUtil from "../util/ArrayUtil";

const THEME_COLOR = '#678'

type Props = {};

class CustomKeyPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.changeValues = []
    this.isRemoveKey = !!this.params.isRemoveKey
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      keys: []
    }
  }

  static _keys(props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    if (isRemoveKey && !original) {
      return state && state.keys && state.keys.length && state.keys || props.language[key].map(e => {
        return {
          ...e,
          checked: false
        }
      })
    } else {
      return props.language[key]
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const keys = CustomKeyPage._keys(nextProps, null, prevState)
    if (prevState.keys !== keys) {
      return {
        keys
      }
    }
    return null
  }

  componentDidMount() {
    this.backPress.componentDidMount()
    if (!CustomKeyPage._keys(this.props).length) {
      const {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props)
    })
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress() {
    this.onBack()
    return true
  }

  renderView() {
    let dataArray = this.state.keys
    if (!dataArray || !dataArray.length) return
    const views = []
    for (let i = 0, length = dataArray.length; i < length; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i + 1 < length && this.renderCheckBox(dataArray[i + 1], i + 1)}
          </View>
          <View style={GlobalStyles.line}></View>
        </View>
      )
    }
    return views
  }

  onClick(data, index) {
    data.checked = !data.checked
    ArrayUtil.updateArray(this.changeValues, data)
    this.state.keys[index] = data
    this.setState({
      keys: this.state.keys
    })
  }

  _checkImage(checked) {
    return <Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      style={{
        color: THEME_COLOR
      }}
    />
  }

  goBack() {
    if (this.changeValues.length) {
      Alert.alert('提示', '确认保存修改吗?', [{
        text: '否',
        onPress: () => {
          NavigationUtil.goBack(this.props.navigation)
        }
      }, {
        text: '是',
        onPress: () => {
          this.onSave()
        }
      }])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onSave() {
    if (!this.changeValues.length) {
      NavigationUtil.goBack(this.props.navigation)
      return
    }
    let keys
    if (this.isRemoveKey) {
      this.changeValues.forEach((e) => {
        ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), e, 'name')
      })
    }
    this.languageDao.save(keys || this.state.keys)
    const {onLoadLanguage} = this.props
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }

  renderCheckBox(data, index) {
    return <CheckBox
      style={{flex: 1, padding: 10}}
      onClick={() => this.onClick(data, index)}
      isChecked={data.checked}
      leftText={data.name}
      checkImage={this._checkImage(true)}
      unCheckImage={this._checkImage(false)}
    />
  }

  render() {
    let title = this.isRemoveKey ? '标签移除' : '自定义标签'
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title
    const rightButtonTitle = this.isRemoveKey ? '移除' : '保存'
    const navigationBar = <NavigationBar
      title={title}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={ViewUtil.getTextButton(rightButtonTitle, () => this.onSave())}
      leftButton={ViewUtil.getLeftBackButton(() => this.goBack())}
    />
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
        {navigationBar}
        <ScrollView>
          {this.renderView()}
        </ScrollView>
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  language: state.language
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  item: {
    flexDirection: 'row'
  },
});
