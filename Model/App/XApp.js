import { klee } from '../klee.js'
import { XAppConfigYamlFile } from '../File/YamlFile/ConfigYamlFile/XAppConfigYamlFile.js'
import { XPuppeteer } from '../Puppeteer/XPuppeteer.js'
import { XSleep } from '../Sleep/XSleep.js'
import { XkleeConfigYamlFile } from '../File/YamlFile/ConfigYamlFile/XkleeConfigYamlFile.js'
import { XLog } from '../Log/XLog.js'
import { XUserDataYamlFile } from '../File/YamlFile/DataYamlFile/XUserDataYamlFile.js'
import { XObject } from '../Object/XObject.js'
import { XkleeDataYamlFile } from '../File/YamlFile/DataYamlFile/XkleeDataYamlFile.js'
import { XUser } from '../User/XUser.js'
import fs from 'fs'
import path from 'path'
import lodash from 'lodash'

const AppConfigYamlFile = new XAppConfigYamlFile()
const puppeteer = new XPuppeteer()
const sleep = new XSleep()
const kleeConfigYamlFile = new XkleeConfigYamlFile()
const log = new XLog()
const UserDataYamlFile = new XUserDataYamlFile()
const kleeDataYamlFile = new XkleeDataYamlFile()
const object = new XObject()

/** 功能类 */
class XApp extends klee {
    /** 所属模块名 */
    modelName
    /** 名称 */
    name
    /** 描述 */
    dsc
    /** 监听事件，默认message */
    event
    /** 优先级 */
    priority
    /** 定时任务，可以是数组 */
    task
    /** 命令规则 */
    rule
    /** 陈述 */
    stateArr
    /** oicq事件参数 */
    e
    /** 用户qq */
    usrQQ
    /** 用户所在qq群 */
    groupQQ
    /** 机器人名字 */
    botName
    /** 雪宝替代名 */
    XueBaoName
    /** 用户对象 */
    user

    /**
     * @param modelName { String } 所属模块名
     * @param name { String } 名称
     * @param dsc { String } 描述
     * @param event { String } 执行事件
     */
    constructor(modelName,name,dsc,event) {
        super()
        if (kleeDataYamlFile.getStopklee()) {
            return
        }
        this.modelName = modelName
        this.rule = []
        this.stateArr = {}
        this.botName = kleeConfigYamlFile.getUsrBotName()
        this.XueBaoName = kleeConfigYamlFile.getUsrXueBaoName()
        this.name = name
        this.dsc = dsc
        this.event = event
        this.priority = AppConfigYamlFile.getUsrAppPriority(this.modelName,this.name)
        let fncNames = AppConfigYamlFile.getUsrAppFncNames(this.modelName,this.name)
        if (fncNames) {
            for (let i = 0; i < fncNames.length; i++) {
                let reg = AppConfigYamlFile.getUsrAppReg(this.modelName,this.name,fncNames[i])
                let regKey = AppConfigYamlFile.getUsrAppRegKey(this.modelName,this.name,fncNames[i])
                let dsc = AppConfigYamlFile.getUsrAppDsc(this.modelName,this.name,fncNames[i])
                if (this.modelName !== 'klee') {
                    reg = this.replacekleeAndXueBao(reg)
                    regKey = this.replacekleeAndXueBao(regKey)
                    dsc = this.replacekleeAndXueBao(dsc)
                }
                this.rule.push({
                    reg: reg,
                    regKey: regKey,
                    fnc: fncNames[i],
                    dsc: dsc,
                    chatType: AppConfigYamlFile.getUsrAppChatType(this.modelName,this.name,fncNames[i]),
                    event: AppConfigYamlFile.getUsrAppEvent(this.modelName,this.name,fncNames[i]),
                    log: AppConfigYamlFile.getUsrAppIsShowLog(this.modelName,this.name,fncNames[i]),
                    permission: AppConfigYamlFile.getUsrAppPermission(this.modelName,this.name,fncNames[i]),
                    permissionLevel: AppConfigYamlFile.getUsrAppkleePermissionLevel(this.modelName,this.name,fncNames[i]),
                    favorabilityLevel: AppConfigYamlFile.getUsrAppkleeFavorabilityLevel(this.modelName,this.name,fncNames[i])
                })
            }
        }
        this.task = {
            name: '',
            fnc: '',
            cron: ''
        }
    }

    /**
     * 获取所有功能服务名
     */
    async getAllAppServiceName() {
        const plugins = fs.readdirSync(path.join(this.kleeRootAbsPath,'../'))
        let appServiceNames = {}
        for (const plugin of plugins) {
            if (plugin === 'bin' || plugin === '.gitignore' || plugin === 'games-template-plugin-zolay-liulian') {
                continue
            }
            const pluginAppsPath = path.join(this.kleeRootAbsPath,'../',plugin,'apps')
            if (plugin === 'achievements-plugin') {
                appServiceNames[plugin] = []
                const module = await import(`../../../../plugins/${plugin}/version/3x.js`)
                lodash.forEach(module,(p,i) => {
                    let object
                    try {
                        object = new p()
                    } catch (e) {
                        return
                    }
                    appServiceNames[plugin].push(object.name)
                })
                continue
            }
            if (plugin === 'py-plugin') {
                appServiceNames[plugin] = []
                const module = await import(`../../../../plugins/${plugin}/index.js`)
                lodash.forEach(module,(p,i) => {
                    let object
                    try {
                        object = new p()
                    } catch (e) {
                        return
                    }
                    appServiceNames[plugin].push(object.name)
                })
                continue
            }
            if (plugin === 'xiaoyao-cvs-plugin' ||
                plugin === 'liulian-plugin' ||
                plugin === 'recreation-plugin' ||
                plugin === 'windoge-plugin' ||
                plugin === 'zhi-plugin') {
                appServiceNames[plugin] = []
                const module = await import(`../../../../plugins/${plugin}/adapter/index.js`)
                lodash.forEach(module,(p,i) => {
                    let object
                    try {
                        object = new p()
                    } catch (e) {
                        return
                    }
                    appServiceNames[plugin].push(object.name)
                })
                continue
            }
            if (plugin === 'miao-plugin') {
                appServiceNames[plugin] = []
                const miaoPlugins = fs.readdirSync(pluginAppsPath)
                for (const miaoPlugin of miaoPlugins) {
                    if (miaoPlugin.endsWith('.js') && miaoPlugin !== 'index.js') {
                        const module = await import(`../../../../plugins/${plugin}/apps/${miaoPlugin}`)
                        lodash.forEach(module,(p,i) => {
                            if (p.cfg !== undefined) {
                                appServiceNames[plugin].push(`喵喵:${p.cfg.name}`)
                            }
                        })
                    }
                }
                continue
            }
            if (plugin === 'klee-cultivate-plugin') {
                const defAppConfig = AppConfigYamlFile.getDefAppConfigYaml()
                const modules = Object.keys(defAppConfig)
                appServiceNames[plugin] = {}
                for (const module of modules) {
                    appServiceNames[plugin][module] = []
                    const apps = Object.keys(defAppConfig[module])
                    for (const app of apps) {
                        appServiceNames[plugin][module].push(app)
                    }
                }
                if (fs.existsSync(path.join(this.kleeRootAbsPath,'App/Expand'))) {
                    const expandAppConfig = AppConfigYamlFile.getUsrAppConfigYaml('Expand')
                    const expandModules = Object.keys(expandAppConfig)
                    appServiceNames[plugin]['Expand'] = []
                    for (const module of expandModules) {
                        appServiceNames[plugin]['Expand'].push(module)
                    }
                }
                continue
            }
            if (plugin === 'alemon-plugin' ||
                plugin === 'akasha-terminal-plugin' ||
                plugin === 'lin-plugin' ||
                plugin === 'xiuxian-plugin') {
                appServiceNames[plugin] = {}
                const alemonPluginModules = fs.readdirSync(pluginAppsPath)
                for (const alemonPluginModule of alemonPluginModules) {
                    if (plugin === 'akasha-terminal-plugin' && alemonPluginModule === 'help') {
                        continue
                    }
                    if (plugin === 'lin-plugin' && alemonPluginModule === 'back') {
                        continue
                    }
                    if (alemonPluginModule === 'user' && plugin === 'xiuxian-plugin') {
                        const alemonPluginUserModules = fs.readdirSync(path.join(pluginAppsPath,alemonPluginModule))
                        for (const alemonPluginUserModule of alemonPluginUserModules) {
                            appServiceNames[plugin][alemonPluginUserModule] = []
                            const alemonPlugins = fs.readdirSync(path.join(pluginAppsPath,alemonPluginModule,alemonPluginUserModule))
                            for (const alemonPlugin of alemonPlugins) {
                                if (alemonPlugin.endsWith('.js')) {
                                    const module = await import(`../../../../plugins/${plugin}/apps/${alemonPluginModule}/${alemonPluginUserModule}/${alemonPlugin}`)
                                    lodash.forEach(module,(p,i) => {
                                        let object
                                        try {
                                            object = new p()
                                        } catch (e) {
                                            return
                                        }
                                        appServiceNames[plugin][alemonPluginUserModule].push(object.name)
                                    })
                                }
                            }
                        }
                        continue
                    }
                    appServiceNames[plugin][alemonPluginModule] = []
                    const alemonPlugins = fs.readdirSync(path.join(pluginAppsPath,alemonPluginModule))
                    for (const alemonPlugin of alemonPlugins) {
                        if (alemonPlugin.endsWith('.js')) {
                            const module = await import(`../../../../plugins/${plugin}/apps/${alemonPluginModule}/${alemonPlugin}`)
                            lodash.forEach(module,(p,i) => {
                                let object
                                try {
                                    object = new p()
                                } catch (e) {
                                    return
                                }
                                appServiceNames[plugin][alemonPluginModule].push(object.name)
                            })
                        }
                    }
                }
                continue
            }
            if (plugin === 'auto-plugin') {
                appServiceNames[plugin] = []
                const apps = fs.readdirSync(path.join(this.kleeRootAbsPath,'../',plugin,'app'))
                for (const app of apps) {
                    let module = await import(`../../../../plugins/${plugin}/app/${app}`)
                    lodash.forEach(module, (p,i) => {
                        let object
                        try {
                            object = new p()
                        } catch (e) {
                            return
                        }
                        appServiceNames[plugin].push(object.name)
                    })
                }
                continue
            }
            appServiceNames[plugin] = []
            if (plugin === 'TRSS-Plugin') {
                const apps = fs.readdirSync(path.join(this.kleeRootAbsPath,'../',plugin,'Apps'))
                for (const app of apps) {
                    if (!app.endsWith('.js')) {
                        continue
                    }
                    const module = await import(`../../../../plugins/${plugin}/Apps/${app}`)
                    lodash.forEach(module, (p,i) => {
                        let object
                        try {
                            object = new p()
                        } catch (e) {
                            return
                        }
                        appServiceNames[plugin].push(object.name)
                    })
                }
                continue
            }
            if (fs.existsSync(path.join(this.kleeRootAbsPath,'../',plugin,'apps'))) {
                const apps = fs.readdirSync(path.join(this.kleeRootAbsPath,'../',plugin,'apps'))
                for (const app of apps) {
                    if (!app.endsWith('.js')) {
                        continue
                    }
                    if ((plugin === 'expand-plugin' ||
                        plugin === 'earth-k-plugin' ||
                        plugin === 'hs-qiqi-plugin' ||
                        plugin === 'xiaofei-plugin') && app === 'help') {
                        continue
                    }
                    if (plugin === 'Icepray' && app === 'fishing') {
                        continue
                    }
                    if (plugin === 'WeLM-plugin' && app === 'Help') {
                        continue
                    }
                    if (plugin === 'zhishui-plugin' && app === 'sj') {
                        continue
                    }
                    if (plugin === 'vits-yunzai-Plugin' && app === '.keep') {
                        continue
                    }
                    const module = await import(`../../../../plugins/${plugin}/apps/${app}`)
                    lodash.forEach(module, (p,i) => {
                        let object
                        try {
                            object = new p()
                        } catch (e) {
                            return
                        }
                        appServiceNames[plugin].push(object.name)
                    })
                }
            } else {
                const apps = fs.readdirSync(path.join(this.kleeRootAbsPath,'../',plugin))
                for (const app of apps) {
                    let module = await import(`../../../../plugins/${plugin}/${app}`)
                    lodash.forEach(module, (p,i) => {
                        let object
                        try {
                            object = new p()
                        } catch (e) {
                            return
                        }
                        appServiceNames[plugin].push(object.name)
                    })
                }
            }
        }
        return appServiceNames
    }

    /**
     * 替换掉'可莉'和'雪宝'
     * @param str { String } 要替换的字串
     * @return { String }
     */
    replacekleeAndXueBao(str) {
        return str.replace('可莉',this.botName).replace('雪宝',this.XueBaoName)
    }

    /**
     * @param msg 发送的消息
     * @param quote { Boolean } 是否引用回复
     * @param {{recallMsg: Number,at: Boolean}} data
     * recallMsg: 群聊是否撤回消息，0-120秒，0不撤回
     * at: 是否at用户
     */
    reply(msg,quote = true,data = { at: false, recallMsg: 0 }) {
        if (!this.e.reply || !msg) {
            return false
        }
        this.e.reply(msg,quote,data)
        return true
    }

    /**
     * 生成关键字
     * @param isGroup { Boolean } 是否群聊
     */
    conKey(isGroup = false) {
        if (isGroup) {
            return `${this.name}.${this.e.group_id}`
        }
        else {
            return `${this.name}.${this.e.user_id}`
        }
    }

    /**
     * 设置操作内容
     * @param type { String } 执行类型
     * @param isGroup { Boolean } 是否群聊
     * @param time { Number } 操作时间，默认120秒
     */
    setContext(type,isGroup = false,time = 120) {
        const key = this.conKey(isGroup)
        if (!this.stateArr[key]) {
            this.stateArr[key] = {}
        }
        this.stateArr[key][type] = this.e
        if (time) {
            setTimeout(() => {
                if (this.stateArr[key][type]) {
                    delete this.stateArr[key][type]
                    this.e.reply('操作超时已取消',true)
                }
            },time * 1000)
        }
    }

    /**
     * 获取非群聊操作内容
     */
    getContext() {
        const key = this.conKey()
        return this.stateArr[key]
    }

    /**
     * 获取群聊操作内容
     */
    getContextGroup() {
        const key = this.conKey(true)
        return this.stateArr[key]
    }

    /**
     * 完成操作
     * @param type { String } 执行类型
     * @param isGroup { Boolean } 是否群聊
     */
    finish(type,isGroup = false) {
        if (this.stateArr[this.conKey(isGroup)] && this.stateArr[this.conKey(isGroup)][type]) {
            delete this.stateArr[this.conKey(isGroup)][type]
        }
    }

    /**
     * 去掉用户消息中的命令修饰符
     * @param modifier { String } 修饰符
     * @param msg { String } 用户文字消息
     */
    removeCommandModifier(modifier,msg) {
        return msg.replace(modifier,'')
    }

    /**
     * 从logFnc中提取出功能的执行方法名称
     */
    getFncName() {
        return this.e.logFnc
            .replace(`[${this.name}]`,'')
            .replace('[','')
            .replace(']','')
    }

    /**
     * 从logFnc中提取出功能的名称
     */
    getAppName() {
        return this.e.logFnc
            .split(']')[0]
            .replace('[','')
    }

    /**
     * 去掉用户消息中有关指令的内容
     * @param reg { String } 指令
     * @param msg { String } 用户文字消息
     */
    removeReg(reg,msg) {
        return msg.replace(reg,'')
    }

    /**
     * 获取用户消息中实际有效的内容
     * @param reg { String } 指令关键词
     * @param modifier { String } 修饰符
     * @param msg { String } 用户文字消息
     * @return { String }
     */
    getEffectiveContent(reg, modifier, msg) {
        msg = this.removeCommandModifier(modifier,msg)
        msg = this.removeReg(reg,msg)
        return msg
    }

    /**
     * 获取当前正在执行的功能的指令关键词
     */
    getCurrentFncRegKey() {
        for (let i = 0; i < this.rule.length; i++) {
            if (this.rule[i]['fnc'] === this.getFncName()) {
                return this.rule[i]['regKey']
            }
        }
    }

    /**
     * 发送私聊消息，仅给好友发送
     * @param usrQQ { Number } qq号
     * @param msg 消息
     */
    async replyPrivate(usrQQ, msg) {
        usrQQ = Number(usrQQ)
        const friend = Bot.fl.get(usrQQ)
        if (friend) {
            log.mark(`发送好友消息[${friend.nickname}](${usrQQ})`)
            return await Bot
                .pickUser(usrQQ)
                .sendMsg(msg)
                .catch(err => log.mark(err))
        }
    }

    /**
     * 制作转发消息
     * @param msgs 消息数组
     * @param dsc { String } 转发描述
     */
    async makeForwardMsg(msgs = [],dsc = '') {
        let nickname = Bot.nickname
        if (this.e.isGroup) {
            const info = await Bot.getGroupMemberInfo(this.e.group_id, Bot.uin)
            nickname = info.card || info.nickname
        }
        let botInfo = {
            user_id: Bot.uin,
            nickname
        }
        let forwardMsg = []
        msgs.forEach(v => {
            forwardMsg.push({
                ...botInfo,
                message: v
            })
        })
        /** 制作转发内容 */
        if (this.e.isGroup) {
            forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
        }
        else if (this.e.friend) {
            forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
        }
        else {
            return false
        }
        if (dsc) {
            /** 处理描述 */
            forwardMsg.data = forwardMsg.data
                .replace(/\n/g, '')
                .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
                .replace(/___+/, `<title color="#777777" size="26">${dsc}</title>`)
        }
        return forwardMsg
    }

    /**
     * 获取当前执行功能方法的配置
     */
    getCurrentFncConfig() {
        for (let i = 0; i < this.rule.length; i++) {
            if (this.rule[i]['fnc'] === this.getFncName()) {
                return this.rule[i]
            }
        }
    }

    /**
     * 判断用户能否使用这个方法
     * @param usrQQ { Number } 用户QQ号，0代表不接收参数
     * @return { Boolean }
     */
    async canUseFnc(usrQQ) {
        this.initUsrQQAndGroupQQ(usrQQ)
        this.user = new XUser(this.usrQQ)
        const fncConfig = this.getCurrentFncConfig()
        const needPermissionLevel = fncConfig['permissionLevel']
        const currentPermissionLevel = UserDataYamlFile.getUsrkleePermissionLevel(this.usrQQ)
        const needFavorability = fncConfig['favorability']
        const currentFavorability = UserDataYamlFile.getUsrkleeFavorability(this.usrQQ)
        const needChatType = fncConfig['chatType']
        const permission = fncConfig['permission']
        if (this.e.isPrivate) {
            if (needChatType === 'group') {
                await this.e.reply('当前指令私聊不触发，请在群聊中使用',true)
                return false
            }
        } else {
            if (needChatType === 'private') {
                await this.e.reply('当前指令群聊不触发，请私聊使用',true)
                return false
            }
        }
        if (currentPermissionLevel < needPermissionLevel) {
            await this.e.reply(`您的${this.botName}权限等级不够，无法使用`,true)
            return false
        } else {
            if (currentFavorability < needFavorability) {
                await this.e.reply(`您的${this.botName}好感度不够，无法使用`,true)
                return false
            }
        }
        if (permission === 'masterAndAgent') {
            if (this.user.isAgent(this.groupQQ) || this.user.isMaster()) {
                return true
            } else {
                await this.e.reply(`权限不足，请联系${this.botName}在本群的代理人或婉婷姐姐`)
                return false
            }
        }
        return true
    }

    /**
     * 获取某群中某用户的昵称
     * @param groupQQ { Number } 群号
     * @param usrQQ { Number } 用户QQ号
     */
    async getNickname(groupQQ,usrQQ) {
        const group = Bot.pickGroup(groupQQ)
        const groupMemberMap = await group.getMemberMap()
        const userInfo = await groupMemberMap.get(usrQQ)
        if (userInfo) {
            if (userInfo['card'] === '') {
                return userInfo['nickname']
            }
            else {
                return userInfo['card']
            }
        }
        return group.pickMember(usrQQ).info.nickname
    }

    /**
     * 分页发送图片
     * @param data 模板数据
     * @param dataName { String } 分页数据名
     * @param modelName { String } 模块名
     * @param dsc { String } 转发消息描述
     */
    async sendPicturesInPages(data,dataName,modelName,dsc) {
        let newData = {}
        object.deepCopy(newData,data)
        newData['totalPage'] = Math.ceil(data['htmlData'][dataName].length / 50)
        newData['currentPage'] = 0
        let operatingData = []
        let imgs = []
        for (let i = 0, len = data['htmlData'][dataName].length; i < len; i++) {
            operatingData.push(data['htmlData'][dataName][i])
            if ((i + 1) % 50 === 0 || (i + 1) === len) {
                newData['htmlData'][dataName] = operatingData
                newData.currentPage++
                let img = await puppeteer.cache(modelName, newData)
                operatingData = []
                imgs.push(img)
                await sleep.sleep(2000)
            }
        }
        return await this.makeForwardMsg(imgs,dsc)
    }

    /**
     * 初始化this.usrQQ和this.groupQQ
     * @param usrQQ { Number } 用户QQ号，0代表不接收参数
     */
    initUsrQQAndGroupQQ(usrQQ) {
        if (!usrQQ) {
            this.usrQQ = this.e.sender.user_id
        }
        else {
            this.usrQQ = usrQQ
        }
        if (this.e.isGroup) {
            this.groupQQ = this.e.group_id
        }
    }
}

export { XApp }