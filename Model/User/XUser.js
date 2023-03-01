import { klee } from '../klee.js'
import { XUserDataYamlFile } from '../File/YamlFile/DataYamlFile/XUserDataYamlFile.js'
import { XkleeDataYamlFile } from '../File/YamlFile/DataYamlFile/XkleeDataYamlFile.js'
import cfg from '../../../../lib/config/config.js'

const UserDataYamlFile = new XUserDataYamlFile()
const kleeDataYamlFile = new XkleeDataYamlFile()

/** 用户类 */
class XUser extends klee {
    /** qq */
    QQ
    /** 昵称 */
    nickname
    /** 机器人对用户的称呼 */
    address
    /** 头像url */
    avatarUrl
    /** 性别 */
    sex
    /** 生日 */
    birthday
    /** 所在地区 */
    area
    /** 机器人与用户的最多最近20条聊天记录 */
    chatHistory
    /** 要保存的聊天记录条数 */
    chatHistoryCount
    /** 可莉权限等级 */
    kleePermissionLevel
    /** 可莉好感度 */
    kleeFavorability
    /** 可莉好感度等级 */
    kleeFavorabilityLevel
    /** 与机器人的关系 */
    relationshipWithBot
    /** 与其他用户的好感度 */
    favorabilityWithOther
    /** 与其他用户的好感度等级 */
    favorabilityLevelWithOther
    /** 与其他用户的关系 */
    relationshipWithOther
    /** 雪币 */
    XueBi
    /** 背包 */
    backpack
    /** oicq对象 */
    oicq

    /**
     * @param qq { Number } 用户QQ号
     */
    constructor(qq) {
        super()
        this.QQ = qq
        this.address = ''
        this.birthday = ''
        this.chatHistoryCount = 20
        this.kleePermissionLevel = 0
        this.relationshipWithBot = []
        let info
        if (this.isMaster()) {
            this.relationshipWithBot.push('master')
            this.kleePermissionLevel = 5
        }
        if (this.isFriend(this.QQ)) {
            this.relationshipWithBot.push('friend')
            this.oicq = Bot.pickFriend(qq)
            info = this.oicq.getSimpleInfo()
            this.nickname = this.oicq.nickname
            this.sex = this.oicq.sex
        } else {
            this.relationshipWithBot.push('stranger')
            this.oicq = Bot.pickUser(qq)
            info = this.oicq.getSimpleInfo()
            this.nickname = info.nickname
            this.sex = info.sex
        }
        this.area = info.area
        this.chatHistory = this.oicq.getChatHistory()
        this.avatarUrl = this.oicq.getAvatarUrl()
        this.kleeFavorability = 0
        this.kleeFavorabilityLevel = 0
        this.favorabilityWithOther = {}
        this.favorabilityLevelWithOther = {}
        this.relationshipWithOther = {}
        this.XueBi = 0
        this.backpack = {}
        if (UserDataYamlFile.getUserInfo(this.QQ) === null) {
            this.saveUsrInfo()
        }
    }

    /**
     * 判断是不是好友
     */
    isFriend() {
        const friends = Bot.fl
        return !!friends.get(this.QQ)
    }

    /**
     * 判断是不是某个群聊的代理人
     * @param qq { Number } 群号
     */
    isAgent(qq) {
        const agents = kleeDataYamlFile.getAgents(qq)
        if (agents === null) {
            return false
        }
        for (const agent of agents) {
            if (agent === this.QQ) {
                return true
            }
        }
        return false
    }

    /**
     * 判断是不是主人
     */
    isMaster() {
        return cfg.masterQQ.includes(this.QQ)
    }

    /**
     * 保存用户信息到yaml文件
     */
    saveUsrInfo() {
        UserDataYamlFile.saveUserInfo(this.QQ,{
            nickname: this.nickname,
            address: this.address,
            avatarUrl: this.avatarUrl,
            sex: this.sex,
            birthday: this.birthday,
            area: this.area,
            chatHistoryCount: this.chatHistoryCount,
            chatHistory: this.chatHistory,
            kleePermissionLevel: this.kleePermissionLevel,
            kleeFavorability: this.kleeFavorability,
            kleeFavorabilityLevel: this.kleeFavorabilityLevel,
            relationshipWithBot: this.relationshipWithBot,
            favorabilityWithOther: this.favorabilityWithOther,
            favorabilityLevelWithOther: this.favorabilityLevelWithOther,
            relationshipWithOther: this.relationshipWithOther,
            XueBi: this.XueBi,
            backpack: this.backpack
        })
    }
}

export { XUser }