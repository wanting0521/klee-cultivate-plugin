import { XRandom } from './XRandom.js'

/** 随机数类 */
class XRandomNumber extends XRandom {
    constructor() {
        super()
    }

    /**
     * 生成一个 a 到 b 之间的随机数
     * @param minNum { Number } a
     * @param maxNum { Number } b
     */
    getRandomNum(minNum, maxNum) {
        return parseInt(`${Math.random() * (maxNum - minNum + 1) + minNum}`, 10)
    }
}

export { XRandomNumber }