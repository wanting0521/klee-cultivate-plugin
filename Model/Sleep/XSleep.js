import { klee } from '../klee.js'

/** 休眠类 */
class XSleep extends klee {
    constructor() {
        super()
    }

    /**
     * 休眠
     * @param ms { Number } 毫秒
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

export { XSleep }