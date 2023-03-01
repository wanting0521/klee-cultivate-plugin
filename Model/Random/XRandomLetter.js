import { XRandom } from './XRandom.js'
import { XRandomNumber } from './XRandomNumber.js'

const randomNumber = new XRandomNumber()

/** 随机字母类 */
class XRandomLetter extends XRandom {
    constructor() {
        super()
    }

    /**
     * 从26个小写英文字母中随机获取一个
     * @return { String }
     */
    getRandomLowerCaseLetter() {
        const number = randomNumber.getRandomNum(97,122)
        return String.fromCharCode(number)
    }

    /**
     * 从26个大写英文字母中随机获取一个
     * @return { String }
     */
    getRandomBiggerCaseLetter() {
        const number = randomNumber.getRandomNum(65,90)
        return String.fromCharCode(number)
    }
}

export { XRandomLetter }