import ProjectModel from "../model/ProjectModel";
import Utils from '../util/Utils'

export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao) {
  let fixItems = []
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items
    }
  }
  const showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize)
  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      items: fixItems,
      type: actionType,
      projectModels,
      pageIndex: 1,
      storeName
    })
  })
}

export async function _projectModels(showItems, favoriteDao, cb) {
  let keys = []
  try {
    keys =  await favoriteDao.getFavoriteKeys()
  } catch (e) {
    console.log(e)
  }

  let projectModels = []
  for (let i = 0, length = showItems.length; i < length; i++) {
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)))
  }
  cb && cb(projectModels)
}
