const faker = require('faker')
const makeData = require('../../data/data')

module.exports = function makeFakeData (spec = {}) {
  return makeData({
    userId: 5,
    id : 5,
    title : "APSdojpAISJD89ADj",
    ...spec
  })
}