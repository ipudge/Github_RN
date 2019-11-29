export default class ArrayUtil {

  static isEqual(arr1, arr2) {
    if (!(arr1 && arr2)) return false
    if (arr1.length !== arr2.length) return false
    for (let i = 0, l = arr1.length; i < l; i++) {
      if (arr1[i] !== arr2[i]) return false
    }
    return true
  }

  static updateArray(arr, item) {
    const index = arr.indexOf(item)
    if (index > -1){
      arr.splice(index, 1)
    } else {
      arr.push(item)
    }
  }
  static remove(arr, item, key) {
    if (!arr) return
    for (let i = 0, length = arr.length; i < length; i++) {
      const val = arr[i]
      if (item === val || val && val[key] && val[key] === item[key]) {
        arr.splice(i, 1)
      }
    }
    return arr
  }
}
