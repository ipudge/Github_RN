import Types from '../types'
import LanguageDao from '../../expand/dao/LanguageDao'

export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      const languages = await new LanguageDao(flagKey).fetch()
      dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages, flag: flagKey})
    } catch (e) {
      console.log(e)
    }
  }
}
