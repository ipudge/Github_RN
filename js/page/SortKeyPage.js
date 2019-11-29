import React, {Component} from 'react';
import {StyleSheet, Alert, View, DeviceInfo, TouchableHighlight, Text} from 'react-native';
import {connect} from 'react-redux'
import SortableListView from 'react-native-sortable-listview'
import actions from '../action'
import NavigationBar from '../common/NavigationBar'
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import NavigationUtil from "../navigator/NavigationUtil";
import ArrayUtil from "../util/ArrayUtil";

const THEME_COLOR = '#678'

type Props = {};

class SortKeyPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      checkedArray: SortKeyPage._keys(this.props)
    }
  }

  static _keys(props, state) {
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray
    }
    const flag = SortKeyPage._flag(props)
    const dataArray = props.language[flag] || []
    let keys = []
    dataArray.forEach(e => {
      e.checked && keys.push(e)
    })
    return keys
  }

  static _flag(props) {
    const {flag} = props.navigation.state.params
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, prevState)
    if (prevState.checkedArray !== checkedArray) {
      return {
        checkedArray
      }
    }
    return null
  }

  componentDidMount() {
    this.backPress.componentDidMount()
    if (SortKeyPage._keys(this.props).length === 0) {
      const {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress() {
    this.onBack()
    return true
  }

  goBack() {
    if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
      Alert.alert('提示', '确认保存修改吗?', [{
        text: '否',
        onPress: () => {
          NavigationUtil.goBack(this.props.navigation)
        }
      }, {
        text: '是',
        onPress: () => {
          this.onSave(true)
        }
      }])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onSave(hasChecked) {
    if (!hasChecked) {
      if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack(this.props.navigation)
        return
      }
    }
    this.languageDao.save(this.state.checkedArray.slice(0))
    const {onLoadLanguage} = this.props
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }

  render() {
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序'
    const navigationBar = <NavigationBar
      title={title}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={ViewUtil.getTextButton('保存', () => this.onSave())}
      leftButton={ViewUtil.getLeftBackButton(() => this.goBack())}
    />
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
        {navigationBar}
        <SortableListView
          data={this.state.checkedArray}
          order={Object.keys(this.state.checkedArray)}
          onRowMoved={e => {
            this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
            this.forceUpdate()
          }}
          renderRow={row => <RowComponent data={row} {...this.params}/>}
        />
      </View>
    );
  }
}

class RowComponent extends Component {
  render() {
    return <TouchableHighlight
      underlayColor={'#eee'}
      style={this.props.data.checked ? styles.item : styles.hidden}
      {...this.props.sortHandlers}>
      <View style={{marginLeft: 10, flexDirection: 'row'}}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{marginRight: 10, color: THEME_COLOR}}/>
        <Text>{this.props.data.name}</Text>
      </View>
    </TouchableHighlight>
  }
}

const mapPopularStateToProps = state => ({
  language: state.language
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
  hidden: {
    height: 0
  },
  item: {
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  },
});
