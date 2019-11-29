export default class NavigationUtil {
  static goPage(params, page) {
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      console.log('NavigationUtil.navigation can not be null')
      return;
    }
    navigation.navigate(
      page,
      {
        ...params
      }
    )
  }

  static goBack(navigation) {
    navigation.goBack()
  }

  static resetToHomePage({navigation}) {
    navigation.navigate('HomePage')
  }
}
