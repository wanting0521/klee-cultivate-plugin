import { XConfigYamlFile } from './XConfigYamlFile.js'
import { XRandomNumber } from '../../../Random/XRandomNumber.js'
import { XRandomLetter } from '../../../Random/XRandomLetter.js'

const randomNumber = new XRandomNumber()
const randomLetter = new XRandomLetter()

/** App/Bot/Status配置yaml文件类 */
class XAppBotStatusConfigYamlFile extends XConfigYamlFile {
    constructor() {
        super('AppBotStatus')
    }

    /**
     * 判断机器人生日是否设置正确
     * @return { Boolean }
     */
    isBotBirthday() {
        const botBirthday = this.getUsrSubConfig('birthday','BotStatus')
        if (!botBirthday || botBirthday === '') {
            return false
        }
        const reg = new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/)
        return reg.test(botBirthday)
    }

    /**
     * 判断机器人编号是否设置正确
     * @return { Boolean }
     */
    isBotID() {
        const botID = this.getUsrSubConfig('ID','BotStatus')
        if (!botID || botID === '') {
            return false
        }
        const reg = new RegExp(/^[0-9a-zA-Z]{9}$/)
        return reg.test(botID)
    }

    /**
     * 随机生成一个9位字符的机器人编号，大小写英文字母加数字
     * @return { String }
     */
    generateBotID() {
        let botID = ''
        for (let i = 0; i < 9; i++) {
            const number = randomNumber.getRandomNum(1,3)
            switch (number) {
                case 1:
                    botID += randomNumber.getRandomNum(0,9)
                    break
                case 2:
                    botID += randomLetter.getRandomLowerCaseLetter()
                    break
                case 3:
                    botID += randomLetter.getRandomBiggerCaseLetter()
                    break
            }
        }
        return botID
    }
}

export { XAppBotStatusConfigYamlFile }