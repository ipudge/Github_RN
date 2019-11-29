import {AsyncStorage} from 'react-native'
import keys from '../../res/data/keys'
import langs from '../../res/data/langs'

export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'}
export default class FavoriteDao {
  constructor(flag) {
    this.flag = flag
  }
  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result) {
          const data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys
          this.save(data)
          resolve(data)
        } else {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
          }
        }
      })
    })
  }
  save(objectData) {
    const stringData = JSON.stringify(objectData)
    AsyncStorage.setItem(this.flag, stringData, (error, result) => {})
  }
}
