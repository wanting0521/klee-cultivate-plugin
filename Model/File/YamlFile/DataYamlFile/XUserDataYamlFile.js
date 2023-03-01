import { XDataYamlFile } from './XDataYamlFile.js'
import { XDir } from '../../../Dir/XDir.js'
import path from 'path'

const dir = new XDir()

/** User模块数据yaml文件类 */
class XUserDataYamlFile extends XDataYamlFile {
    constructor() {
        super()
        this.dataPath = path.join(this.dataPath,'User')
        dir.mkDirsSync(this.dataPath)
    }

    /**
     * 读取UserInfo.yaml文件
     * @returns { null,any }
     */
    getUserInfoYaml() {
        return this.getData('UserInfo')
    }

    /**
     * 获取指定用户的信息
     * @param qq { Number } 用户QQ号
     * @returns { null,any }
     */
    getUserInfo(qq) {
        const users = this.getUserInfoYaml()
        if (users === null) {
            return null
        }
        if (users[qq]) {
            return users[qq]
        }
        return null
    }

    /**
     * 保存指定用户的信息
     * @param qq { Number } 用户QQ号
     * @param {{
     * nickname: String,
     * address: String,
     * avatarUrl: String,
     * sex: String,
     * birthday: String,
     * area: String,
     * chatHistoryCount Number,
     * chatHistory: any[],
     * kleePermissionLevel: Number,
     * kleeFavorability: Number,
     * kleeFavorabilityLevel: Number,
     * relationshipWithBot: String[],
     * favorabilityWithOther: any,
     * favorabilityLevelWithOther: any,
     * relationshipWithOther: any,
     * XueBi: Number,
     * backpack: any
     * }} info 用户信息
     */
    saveUserInfo(qq,info) {
        let users = this.getUserInfoYaml()
        if (users === null) {
            users = {}
        }
        users[qq] = info
        this.saveData(users,'UserInfo')
    }

    /**
     * 删除一条用户信息
     * @param qq { Number } 用户QQ号
     */
    delUserInfo(qq) {
        let users = this.getUserInfoYaml()
        if (users === null) {
            return
        }
        if (users[qq]) {
            delete users[qq]
            this.saveData(users,'UserInfo')
        }
    }

    /**
     * 获取用户的昵称
     * @param qq { Number } 用户QQ号
     * @returns { null,String }
     */
    getUsrNickname(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['nickname']) {
            return user['nickname']
        }
        return null
    }

    /**
     * 保存用户的昵称
     * @param qq { Number } 用户QQ号
     * @param value { String } 用户昵称
     */
    saveUsrNickname(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['nickname'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取机器人对用户的称呼
     * @param qq { Number } 用户QQ号
     * @returns { null,String[] }
     */
    getUsrAddress(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['address']) {
            return user['address']
        }
        return null
    }

    /**
     * 保存机器人对用户的称呼
     * @param qq { Number } 用户QQ号
     * @param value { String[] } 机器人对用户的称呼
     */
    saveUsrAddress(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['address'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户头像url
     * @param qq { Number } 用户QQ号
     * @returns { null,String }
     */
    getUsrAvatarUrl(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['avatarUrl']) {
            return user['avatarUrl']
        }
        return null
    }

    /**
     * 保存用户头像url
     * @param qq { Number } 用户QQ号
     * @param value { String } 用户头像url
     */
    saveUsrAvatarUrl(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['avatarUrl'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户性别
     * @param qq { Number } 用户QQ号
     * @returns { null,String }
     */
    getUsrSex(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['sex']) {
            return user['sex']
        }
        return null
    }

    /**
     * 保存用户性别
     * @param qq { Number } 用户QQ号
     * @param value { String } 用户性别
     */
    saveUsrSex(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['sex'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户生日
     * @param qq { Number } 用户QQ号
     * @returns { null,String }
     */
    getUsrBirthday(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['birthday']) {
            return user['birthday']
        }
        return null
    }

    /**
     * 保存用户生日
     * @param qq { Number } 用户QQ号
     * @param value { String } 用户生日
     */
    saveUsrBirthday(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['birthday'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户所在地区
     * @param qq { Number } 用户QQ号
     * @returns { null,String }
     */
    getUsrArea(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['area']) {
            return user['area']
        }
        return null
    }

    /**
     * 保存用户所在地区
     * @param qq { Number } 用户QQ号
     * @param value { String } 用户所在地区
     */
    saveUsrArea(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['area'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取要保存的聊天记录条数
     * @param qq { Number } 用户QQ号
     * @returns { null,Number }
     */
    getUsrChatHistoryCount(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['chatHistoryCount']) {
            return user['chatHistoryCount']
        }
        return null
    }

    /**
     * 保存要保存的聊天记录条数
     * @param qq { Number } 用户QQ号
     * @param value { Number } 要保存的聊天记录条数
     */
    saveUsrChatHistoryCount(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['chatHistoryCount'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取机器人与用户的最多最近20条聊天记录
     * @param qq { Number } 用户QQ号
     * @returns { null,any[] }
     */
    getUsrChatHistory(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['chatHistory']) {
            return user['chatHistory']
        }
        return null
    }

    /**
     * 保存机器人与用户的最多最近20条聊天记录
     * @param qq { Number } 用户QQ号
     * @param value { any[] } 机器人与用户的最多最近20条聊天记录
     */
    saveUsrChatHistory(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['chatHistory'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户可莉权限等级
     * @param qq { Number } 用户QQ号
     * @returns { null,Number }
     */
    getUsrkleePermissionLevel(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['kleePermissionLevel']) {
            return user['kleePermissionLevel']
        }
        return null
    }

    /**
     * 保存用户可莉权限等级
     * @param qq { Number } 用户QQ号
     * @param value { Number } 用户可莉权限等级
     */
    saveUsrkleePermissionLevel(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['kleePermissionLevel'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户可莉好感度
     * @param qq { Number } 用户QQ号
     * @returns { null,Number }
     */
    getUsrkleeFavorability(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['kleeFavorability']) {
            return user['kleeFavorability']
        }
        return null
    }

    /**
     * 保存用户可莉好感度
     * @param qq { Number } 用户QQ号
     * @param value { Number } 用户可莉好感度
     */
    saveUsrkleeFavorability(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['kleeFavorability'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户可莉好感度等级
     * @param qq { Number } 用户QQ号
     * @returns { null,Number }
     */
    getUsrkleeFavorabilityLevel(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['kleeFavorabilityLevel']) {
            return user['kleeFavorabilityLevel']
        }
        return null
    }

    /**
     * 保存用户可莉好感度等级
     * @param qq { Number } 用户QQ号
     * @param value { Number } 用户可莉好感度等级
     */
    saveUsrkleeFavorabilityLevel(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['kleeFavorabilityLevel'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户与机器人的关系
     * @param qq { Number } 用户QQ号
     * @returns { null,String[] }
     */
    getUsrRelationshipWithBot(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['relationshipWithBot']) {
            return user['relationshipWithBot']
        }
        return null
    }

    /**
     * 保存用户与机器人的关系
     * @param qq { Number } 用户QQ号
     * @param value { String[] } 用户与机器人的关系
     */
    saveUsrRelationshipWithBot(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['relationshipWithBot'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户与其他用户的好感度
     * @param qq { Number } 用户QQ号
     * @returns { null,any }
     */
    getUsrFavorabilityWithOther(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['favorabilityWithOther']) {
            return user['favorabilityWithOther']
        }
        return null
    }

    /**
     * 保存用户与其他用户的好感度
     * @param qq { Number } 用户QQ号
     * @param value { any } 用户与其他用户的好感度
     */
    saveUsrFavorabilityWithOther(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['favorabilityWithOther'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户与其他用户的好感度等级
     * @param qq { Number } 用户QQ号
     * @returns { null,any }
     */
    getUsrFavorabilityLevelWithOther(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['favorabilityLevelWithOther']) {
            return user['favorabilityLevelWithOther']
        }
        return null
    }

    /**
     * 保存用户与其他用户的好感度等级
     * @param qq { Number } 用户QQ号
     * @param value { any } 用户与其他用户的好感度等级
     */
    saveUsrFavorabilityLevelWithOther(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['favorabilityLevelWithOther'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户与其他用户的关系
     * @param qq { Number } 用户QQ号
     * @returns { null,any }
     */
    getUsrRelationshipWithOther(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['relationshipWithOther']) {
            return user['relationshipWithOther']
        }
        return null
    }

    /**
     * 保存用户与其他用户的关系
     * @param qq { Number } 用户QQ号
     * @param value { any } 用户与其他用户的关系
     */
    saveUsrRelationshipWithOther(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['relationshipWithOther'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户的雪币
     * @param qq { Number } 用户QQ号
     * @returns { null,Number }
     */
    getUsrXueBi(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['XueBi']) {
            return user['XueBi']
        }
        return null
    }

    /**
     * 保存用户的雪币
     * @param qq { Number } 用户QQ号
     * @param value { Number } 用户的雪币
     */
    saveUsrXueBi(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['XueBi'] = value
        this.saveUserInfo(qq,user)
    }

    /**
     * 获取用户的背包
     * @param qq { Number } 用户QQ号
     * @returns { null,any }
     */
    getUsrBackpack(qq) {
        const user = this.getUserInfo(qq)
        if (user === null) {
            return null
        }
        if (user['backpack']) {
            return user['backpack']
        }
        return null
    }

    /**
     * 保存用户的背包
     * @param qq { Number } 用户QQ号
     * @param value { any } 用户的背包
     */
    saveUsrBackpack(qq,value) {
        let user = this.getUserInfo(qq)
        if (user === null) {
            return
        }
        user['backpack'] = value
        this.saveUserInfo(qq,user)
    }
}

export { XUserDataYamlFile }