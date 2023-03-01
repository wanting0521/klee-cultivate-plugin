import { klee } from '../klee.js'
import chalk from 'chalk'

/** 日志类 */
class XLog extends klee {
    constructor() {
        super()
    }

    /**
     * 输出warn日志
     * @param text { String } 描述文本
     */
    warn(text) {
        logger.warn(`${chalk.blue('[kleePlugin]')}${text}`)
    }

    /**
     * 输出并记录info日志
     * @param text { String } 描述文本
     */
    info(text) {
        logger.info(`${chalk.blue('[kleePlugin]')}${text}`)
    }

    /**
     * 输出debug日志
     * @param text { String } 描述文本
     */
    debug(text) {
        logger.debug(`${chalk.blue('[kleePlugin]')}${text}`)
    }

    /**
     * 输出mark日志
     * @param text { String } 描述文本
     */
    mark(text) {
        logger.mark(`${chalk.blue('[kleePlugin]')}${text}`)
    }

    /**
     * 输出并记录错误日志
     * @param text { String } 描述文本
     */
    error(text) {
        logger.error(`${chalk.blue('[kleePlugin]')}${text}`)
    }
}

export { XLog }