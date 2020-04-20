const requiredParam = require('../helpers/required-param')
const InvalidPropertyError = require('../helpers/errors').InvalidPropertyError

module.exports = function makeData(
    data = requiredParam('data')
){
    const vaildData = validate(data)
    const normalizedData = normalize(vaildData)
    return Object.freeze(normalizedData)

    function validate ({
        userId = requiredParam('userId'),
        id = requiredParam('id'),
        title = requiredParam('title'),
        ...otherInfo
    } = {}) {
        validateNumericField('userId', userId)
        validateNumericField('id', id)
        validateTitle('title', title)
        return { userId, id, title, ...otherInfo }
    }

    function validateNumericField(label, field){
        if(!Number.isInteger(field)){
            throw new InvalidPropertyError(
                `A data's ${label} must be an integer`
            )
        }
    }

    function validateTitle(label, title){
        if(title.length < 2){
            throw new InvalidPropertyError(
                `A data's ${label} must be at least two chars long...`
            )
        }
    }

    function normalize ({ userId, id, title, ...otherInfo }) {
        return {
          ...otherInfo,
          userId: userId,
          id: id,
          title: title
        }
      }
}