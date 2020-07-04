const { FILTER_URL } = require('./constant')

module.exports = {
  isTarget: (param, target) => {
    return Object.prototype.toString.call(param).indexOf(target) !== -1
  },
  isJSON: (str) => {
    try {
      JSON.parse(str)
      return true
    } catch (error) {
      return false
    }
  },
  needFilter: (url) => {
    for (const item of FILTER_URL) {
      if (url.indexOf(item) !== -1) {
        return true
      }
    }
    return false
  },
}
