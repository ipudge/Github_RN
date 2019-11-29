import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels, handleData} from '../ActionUtils'

export function onRefreshPopular(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORAGE.flag_popular)//异步action与数据流
      .then(data => {
        handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
      })
      .catch(error => {
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
          storeName,
          error
        });
      })
  }
}

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more')
        }
        dispatch({
          type: Types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex
        })
      } else {
        const max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize
        _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
          dispatch({
            type: Types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels
          })
        })
      }
    }, 500)
  }
}

export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, cb) {
  return dispatch=>{
    //本次和载入的最大数量
    let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
      dispatch({
        type: Types.FLUSH_POPULAR_FAVORITE,
        storeName,
        pageIndex,
        projectModels: data,
      })
    })
    cb && cb()
  }
}
