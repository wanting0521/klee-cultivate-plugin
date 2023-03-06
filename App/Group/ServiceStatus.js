import { XApp } from '../../Model/App/XApp.js'
import { XkleeDataYamlFile } from '../../Model/File/YamlFile/DataYamlFile/XkleeDataYamlFile.js'
import { XAppConfigYamlFile } from '../../Model/File/YamlFile/ConfigYamlFile/XAppConfigYamlFile.js'
import { XPuppeteer } from '../../Model/Puppeteer/XPuppeteer.js'
import { XImgDataRender } from '../../Model/Render/XImgDataRender.js'
import { XSleep } from '../../Model/Sleep/XSleep.js'
import { XUser } from '../../Model/User/XUser.js'
import path from 'path'
import lodash from 'lodash'

const kleeDataYamlFile = new XkleeDataYamlFile()
const AppConfigYamlFile = new XAppConfigYamlFile()
const puppeteer = new XPuppeteer()
const sleep = new XSleep()

/** 服务状态 */
class ServiceStatus extends XApp {
    constructor() {
        super('Group','serviceStatus','管理群聊的服务状态','message')
    }

    /**
     * 查看所有服务
     */
    async viewAllServices(e) {
        if (await this.canUseFnc(0)) {
            const appServiceNames = await this.getAllAppServiceName()
            let msgs = []
            msgs.push('已安装的所有服务如下：\n[] - 插件名\n<> - 模块名\n() - 服务名\n')
            for (const appServiceNamesKey in appServiceNames) {
                msgs.push(`[${appServiceNamesKey}]\n`)
                if ((appServiceNamesKey !== 'klee-cultivate-plugin' &&
                    appServiceNamesKey !== 'alemon-plugin' &&
                    appServiceNamesKey !== 'akasha-terminal-plugin' &&
                    appServiceNamesKey !== 'lin-plugin' &&
                    appServiceNamesKey !== 'xiuxian-plugin')
                    && appServiceNames.hasOwnProperty(appServiceNamesKey)) {
                    for (const appServiceNameElement of appServiceNames[appServiceNamesKey]) {
                        msgs.push(`(${appServiceNameElement})`)
                    }
                    msgs.push('\n')
                } else {
                    for (const appServiceNameKey in appServiceNames[appServiceNamesKey]) {
                        if (appServiceNames[appServiceNamesKey].hasOwnProperty(appServiceNameKey)) {
                            msgs.push(`<${appServiceNameKey}>\n`)
                            for (const appServiceNameElementElement of appServiceNames[appServiceNamesKey][appServiceNameKey]) {
                                msgs.push(`(${appServiceNameElementElement})`)
                            }
                            msgs.push('\n')
                        }
                    }
                }
            }
            await this.reply(msgs)
            return true
        }
        return true
    }

    /**
     * 查看代理人
     */
    async viewAgents(e) {
        if (await this.canUseFnc(0)) {
            const agents = kleeDataYamlFile.getAgents(this.groupQQ)
            if (agents === null || !lodash.isArray(agents) || agents.length === 0) {
                await this.reply('本群暂无代理人~')
                return true
            }
            let msg = '本群代理人如下：\n'
            for (const agent of agents) {
                const user = new XUser(agent)
                msg += `${user.nickname} ${user.QQ}\n`
            }
            await this.reply(msg)
            return true
        }
        return true
    }

    /**
     * 添加代理人
     */
    async addAgent(e) {
        if (await this.canUseFnc(0)) {
            const agentQQ = this.getEffectiveContent(this.getCurrentFncRegKey(),'#',e.msg).trim()
            if (agentQQ === String(Bot.uin)) {
                await this.reply('不能添加自己为代理人~')
                return true
            }
            const user = new XUser(Number(agentQQ))
            if (user.isAgent(this.groupQQ)) {
                await this.reply('已经是代理人啦，无法重复添加~')
                return true
            }
            kleeDataYamlFile.addAgent(this.groupQQ,Number(agentQQ))
            await this.reply('添加成功！')
            return true
        }
        return true
    }

    /**
     * 删除代理人
     */
    async delAgent(e) {
        if (await this.canUseFnc(0)) {
            const agentQQ = this.getEffectiveContent(this.getCurrentFncRegKey(),'#',e.msg).trim()
            const user = new XUser(Number(agentQQ))
            if (!user.isAgent(this.groupQQ)) {
                await this.reply('不是代理人啦，无法删除，姐姐是不是搞错了~')
                return true
            }
            kleeDataYamlFile.delAgent(this.groupQQ,Number(agentQQ))
            await this.reply('删除成功！')
            return true
        }
        return true
    }

    /**
     * 判断所有服务是否开启
     * @param qq { Number } 群号
     * @return { 'on','off','notAll' }
     */
    async getAllServiceStatus(qq) {
        const appServiceNames = await this.getAllAppServiceName()
        let serviceCount = 0
        let startServiceCount = 1
        let endServiceCount = 0
        for (const appServiceNamesKey in appServiceNames) {
            if ((appServiceNamesKey !== 'klee-cultivate-plugin' &&
                appServiceNamesKey !== 'alemon-plugin' &&
                appServiceNamesKey !== 'akasha-terminal-plugin' &&
                appServiceNamesKey !== 'lin-plugin' &&
                appServiceNamesKey !== 'xiuxian-plugin') &&
                appServiceNames.hasOwnProperty(appServiceNamesKey)) {
                for (const appServiceNameElement of appServiceNames[appServiceNamesKey]) {
                    if (kleeDataYamlFile.getGroupServiceStatus(qq,appServiceNamesKey,'-',appServiceNameElement) === 'on') {
                        startServiceCount++
                    } else {
                        endServiceCount++
                    }
                    serviceCount++
                }
            } else {
                for (const appServiceNameKey in appServiceNames[appServiceNamesKey]) {
                    if (appServiceNames[appServiceNamesKey].hasOwnProperty(appServiceNameKey)) {
                        for (const appServiceNameElementElement of appServiceNames[appServiceNamesKey][appServiceNameKey]) {
                            serviceCount++
                            if (appServiceNameElementElement !== 'serviceStatus') {
                                if (kleeDataYamlFile.getGroupServiceStatus(qq,appServiceNamesKey,appServiceNameKey,appServiceNameElementElement) === 'on') {
                                    startServiceCount++
                                } else {
                                    endServiceCount++
                                }
                            }
                        }
                    }
                }
            }
        }
        if (endServiceCount === serviceCount) {
            return 'off'
        }
        if (startServiceCount === serviceCount) {
            return 'on'
        }
        return 'notAll'
    }

    /**
     * 关闭某个服务
     */
    async closeService(e) {
        if (this.canUseFnc(0)) {
            const allServiceStatus = kleeDataYamlFile.getGroupServiceStatus(this.groupQQ,'','','all')
            if (allServiceStatus === 'off') {
                await this.reply('所有服务已关闭，不用再关闭什么~')
                return true
            }
            const serviceName = this.getEffectiveContent(this.getCurrentFncRegKey(),'#',e.msg).replace('服务','').trim()
            if (serviceName === this.name) {
                await this.reply('由于该服务为必要服务，无法关闭，请见谅~')
                return true
            }
            const groupPath = path.join(this.kleeRootAbsPath,'../../config/config/group.yaml')
            let group = AppConfigYamlFile.readYamlFile(groupPath)
            if (group[this.groupQQ] !== undefined) {
                if (group[this.groupQQ]['disable'] === undefined) {
                    group[this.groupQQ]['disable'] = []
                }
            } else {
                group[this.groupQQ] = {}
                group[this.groupQQ]['disable'] = []
            }
            const appServiceNames = await this.getAllAppServiceName()
            for (const appServiceNamesKey in appServiceNames) {
                if ((appServiceNamesKey !== 'klee-cultivate-plugin' &&
                    appServiceNamesKey !== 'alemon-plugin' &&
                    appServiceNamesKey !== 'akasha-terminal-plugin' &&
                    appServiceNamesKey !== 'lin-plugin' &&
                    appServiceNamesKey !== 'xiuxian-plugin') &&
                    appServiceNames.hasOwnProperty(appServiceNamesKey)) {
                    for (const appServiceNameElement of appServiceNames[appServiceNamesKey]) {
                        if (appServiceNameElement === serviceName) {
                            kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,appServiceNamesKey,'-',appServiceNameElement,'off')
                            group[this.groupQQ]['disable'].push(serviceName)
                            AppConfigYamlFile.writeYamlFile(group,groupPath)
                            if (allServiceStatus === 'on') {
                                kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','notAll')
                            }
                            if (await this.getAllServiceStatus(this.groupQQ) === 'off') {
                                kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','off')
                            }
                            await this.reply('服务已关闭~')
                            return true
                        }
                    }
                } else {
                    for (const appServiceNameKey in appServiceNames[appServiceNamesKey]) {
                        if (appServiceNames[appServiceNamesKey].hasOwnProperty(appServiceNameKey)) {
                            for (const appServiceNameElementElement of appServiceNames[appServiceNamesKey][appServiceNameKey]) {
                                if (appServiceNameElementElement === serviceName) {
                                    kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,appServiceNamesKey,appServiceNameKey,appServiceNameElementElement,'off')
                                    group[this.groupQQ]['disable'].push(serviceName)
                                    AppConfigYamlFile.writeYamlFile(group,groupPath)
                                    if (allServiceStatus === 'on') {
                                        kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','notAll')
                                    }
                                    if (await this.getAllServiceStatus(this.groupQQ) === 'off') {
                                        kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','off')
                                    }
                                    await this.reply('服务已关闭~')
                                    return true
                                }
                            }
                        }
                    }
                }
            }
            await this.reply('无效的服务名，可通过查看服务状态获取正确的服务名')
            return true
        }
        return true
    }

    /**
     * 开启某个服务
     */
    async openService(e) {
        if (this.canUseFnc(0)) {
            const allServiceStatus = kleeDataYamlFile.getGroupServiceStatus(this.groupQQ,'','','all')
            if (allServiceStatus === 'on') {
                await this.reply('所有服务已开启，不用再开启什么~')
                return true
            }
            const serviceName = this.getEffectiveContent(this.getCurrentFncRegKey(),'#',e.msg).replace('服务','').trim()
            if (serviceName === this.name) {
                await this.reply('由于该服务为必要服务，不用手动开启~')
                return true
            }
            const groupPath = path.join(this.kleeRootAbsPath,'../../config/config/group.yaml')
            let group = AppConfigYamlFile.readYamlFile(groupPath)
            if (group[this.groupQQ] !== undefined) {
                if (group[this.groupQQ]['disable'] === undefined) {
                    group[this.groupQQ]['disable'] = []
                }
            } else {
                group[this.groupQQ] = {}
                group[this.groupQQ]['disable'] = []
            }
            const appServiceNames = await this.getAllAppServiceName()
            for (const appServiceNamesKey in appServiceNames) {
                if ((appServiceNamesKey !== 'klee-cultivate-plugin' &&
                    appServiceNamesKey !== 'alemon-plugin' &&
                    appServiceNamesKey !== 'akasha-terminal-plugin' &&
                    appServiceNamesKey !== 'lin-plugin' &&
                    appServiceNamesKey !== 'xiuxian-plugin') &&
                    appServiceNames.hasOwnProperty(appServiceNamesKey)) {
                    for (const appServiceNameElement of appServiceNames[appServiceNamesKey]) {
                        if (appServiceNameElement === serviceName) {
                            kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,appServiceNamesKey,'-',appServiceNameElement,'on')
                            for (let i = 0; i < group[this.groupQQ]['disable'].length; i++) {
                                if (group[this.groupQQ]['disable'][i] === serviceName) {
                                    group[this.groupQQ]['disable'].splice(i,1)
                                }
                            }
                            AppConfigYamlFile.writeYamlFile(group,groupPath)
                            if (allServiceStatus === 'off') {
                                kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','notAll')
                            }
                            if (await this.getAllServiceStatus(this.groupQQ) === 'on') {
                                kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','on')
                            }
                            await this.reply('服务已开启~')
                            return true
                        }
                    }
                } else {
                    for (const appServiceNameKey in appServiceNames[appServiceNamesKey]) {
                        if (appServiceNames[appServiceNamesKey].hasOwnProperty(appServiceNameKey)) {
                            for (const appServiceNameElementElement of appServiceNames[appServiceNamesKey][appServiceNameKey]) {
                                if (appServiceNameElementElement === serviceName) {
                                    kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,appServiceNamesKey,appServiceNameKey,appServiceNameElementElement,'on')
                                    for (let i = 0; i < group[this.groupQQ]['disable'].length; i++) {
                                        if (group[this.groupQQ]['disable'][i] === serviceName) {
                                            group[this.groupQQ]['disable'].splice(i,1)
                                        }
                                    }
                                    AppConfigYamlFile.writeYamlFile(group,groupPath)
                                    if (allServiceStatus === 'off') {
                                        kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','notAll')
                                    }
                                    if (await this.getAllServiceStatus(this.groupQQ) === 'on') {
                                        kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','on')
                                    }
                                    await this.reply('服务已开启~')
                                    return true
                                }
                            }
                        }
                    }
                }
            }
            await this.reply('无效的服务名，可通过查看服务状态获取正确的服务名')
            return true
        }
        return true
    }

    /**
     * 关闭所有服务
     */
    async closeAllService(e) {
        if (await this.canUseFnc(0)) {
            kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','off')
            const groupPath = path.join(this.kleeRootAbsPath,'../../config/config/group.yaml')
            let group = AppConfigYamlFile.readYamlFile(groupPath)
            if (group[this.groupQQ] !== undefined) {
                if (group[this.groupQQ]['disable'] === undefined) {
                    group[this.groupQQ]['disable'] = []
                }
            } else {
                group[this.groupQQ] = {}
                group[this.groupQQ]['disable'] = []
            }
            const appServiceNames = await this.getAllAppServiceName()
            for (const appServiceNamesKey in appServiceNames) {
                if ((appServiceNamesKey !== 'klee-cultivate-plugin' &&
                    appServiceNamesKey !== 'alemon-plugin' &&
                    appServiceNamesKey !== 'akasha-terminal-plugin' &&
                    appServiceNamesKey !== 'lin-plugin' &&
                    appServiceNamesKey !== 'xiuxian-plugin')
                    && appServiceNames.hasOwnProperty(appServiceNamesKey)) {
                    for (const appServiceNameElement of appServiceNames[appServiceNamesKey]) {
                        kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,appServiceNamesKey,'-',appServiceNameElement,'off')
                        group[this.groupQQ]['disable'].push(appServiceNameElement)
                    }
                } else {
                    for (const appServiceNameKey in appServiceNames[appServiceNamesKey]) {
                        if (appServiceNames[appServiceNamesKey].hasOwnProperty(appServiceNameKey)) {
                            for (const appServiceNameElementElement of appServiceNames[appServiceNamesKey][appServiceNameKey]) {
                                if (appServiceNameElementElement === this.name) {
                                    continue
                                }
                                kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,appServiceNamesKey,appServiceNameKey,appServiceNameElementElement,'off')
                                group[this.groupQQ]['disable'].push(appServiceNameElementElement)
                            }
                        }
                    }
                }
            }
            AppConfigYamlFile.writeYamlFile(group,groupPath)
            await this.reply('对本群的所有服务已关闭（除必要的klee-cultivate-plugin.serviceStatus服务外）~')
            return true
        }
        return true
    }

    /**
     * 开启所有服务
     */
    async openAllService(e) {
        if (await this.canUseFnc(0)) {
            kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,'','','all','on')
            const groupPath = path.join(this.kleeRootAbsPath,'../../config/config/group.yaml')
            let group = AppConfigYamlFile.readYamlFile(groupPath)
            if (group[this.groupQQ] !== undefined) {
                group[this.groupQQ]['disable'] = []
            } else {
                group[this.groupQQ] = {}
                group[this.groupQQ]['disable'] = []
            }
            AppConfigYamlFile.writeYamlFile(group,groupPath)
            const appServiceNames = await this.getAllAppServiceName()
            for (const appServiceNamesKey in appServiceNames) {
                if ((appServiceNamesKey !== 'klee-cultivate-plugin' &&
                    appServiceNamesKey !== 'alemon-plugin' &&
                    appServiceNamesKey !== 'akasha-terminal-plugin' &&
                    appServiceNamesKey !== 'lin-plugin' &&
                    appServiceNamesKey !== 'xiuxian-plugin') &&
                    appServiceNames.hasOwnProperty(appServiceNamesKey)) {
                    for (const appServiceNameElement of appServiceNames[appServiceNamesKey]) {
                        kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,appServiceNamesKey,'-',appServiceNameElement,'on')
                    }
                } else {
                    for (const appServiceNameKey in appServiceNames[appServiceNamesKey]) {
                        if (appServiceNames[appServiceNamesKey].hasOwnProperty(appServiceNameKey)) {
                            for (const appServiceNameElementElement of appServiceNames[appServiceNamesKey][appServiceNameKey]) {
                                kleeDataYamlFile.setGroupServiceStatus(this.groupQQ,appServiceNamesKey,appServiceNameKey,appServiceNameElementElement,'on')
                            }
                        }
                    }
                }
            }
            await this.reply('对本群的所有服务已开启~')
            return true
        }
        return true
    }

    /**
     * 查看所有服务状态
     */
    async viewServiceStatus(e) {
        if (await this.canUseFnc(0)) {
            await this.reply('别着急，马上给你看~')
            const appServiceNames = await this.getAllAppServiceName()
            let groupServiceStatus = []
            let allServiceStatus = kleeDataYamlFile.getGroupServiceStatus(this.groupQQ,'','','all')
            for (const appServiceNamesKey in appServiceNames) {
                if ((appServiceNamesKey !== 'klee-cultivate-plugin' &&
                    appServiceNamesKey !== 'alemon-plugin' &&
                    appServiceNamesKey !== 'akasha-terminal-plugin' &&
                    appServiceNamesKey !== 'lin-plugin' &&
                    appServiceNamesKey !== 'xiuxian-plugin')
                    && appServiceNames.hasOwnProperty(appServiceNamesKey)) {
                    for (const appServiceNameElement of appServiceNames[appServiceNamesKey]) {
                        groupServiceStatus.push({
                            pluginName: appServiceNamesKey,
                            modelName: '-',
                            serviceName: appServiceNameElement,
                            status: kleeDataYamlFile.getGroupServiceStatus(this.groupQQ,appServiceNamesKey,'-',appServiceNameElement)
                        })
                    }
                } else {
                    for (const appServiceNamesKeyKey in appServiceNames[appServiceNamesKey]) {
                        if (appServiceNames[appServiceNamesKey].hasOwnProperty(appServiceNamesKeyKey)) {
                            for (const appServiceNamesKeyKeyElement of appServiceNames[appServiceNamesKey][appServiceNamesKeyKey]) {
                                groupServiceStatus.push({
                                    pluginName: appServiceNamesKey,
                                    modelName: appServiceNamesKeyKey,
                                    serviceName: appServiceNamesKeyKeyElement,
                                    status: kleeDataYamlFile.getGroupServiceStatus(this.groupQQ,appServiceNamesKey,appServiceNamesKeyKey,appServiceNamesKeyKeyElement)
                                })
                            }
                        }
                    }
                }
            }
            const plugins = Object.keys(appServiceNames)
            let pluginServiceNum = {}
            for (const plugin of plugins) {
                let serviceNum = 0
                for (const groupServiceStatusElement of groupServiceStatus) {
                    if (groupServiceStatusElement['pluginName'] === plugin) {
                        serviceNum ++
                    }
                }
                pluginServiceNum[plugin] = serviceNum
            }
            let msgs = []
            const render = new XImgDataRender('AppGroupServiceStatus','ServiceStatus')
            do {
                for (const plugin of plugins) {
                    let serviceNum = pluginServiceNum[plugin]
                    if (serviceNum === undefined) {
                        continue
                    }
                    let htmlData = {
                        groupQQ: this.groupQQ,
                        allServiceStatus: allServiceStatus,
                        groupServiceStatus: []
                    }
                    if (serviceNum >= 14) {
                        for (let i = serviceNum; i >= 14; i -= 14) {
                            for (let j = 0; j < groupServiceStatus.length; j++) {
                                if (groupServiceStatus[j]['pluginName'] === plugin) {
                                    htmlData.groupServiceStatus.push(groupServiceStatus[j])
                                    serviceNum--
                                    if (pluginServiceNum[plugin] - serviceNum === 14) {
                                        pluginServiceNum[plugin] = serviceNum
                                        if (pluginServiceNum[plugin] === 0) {
                                            delete pluginServiceNum[plugin]
                                        }
                                        break
                                    }
                                }
                            }
                            const data = render.renderImgData(htmlData)
                            const img = await puppeteer.cache('AppGroupServiceStatus',data)
                            msgs.push(img)
                            await sleep.sleep(1000)
                        }
                    } else {
                        for (let k = 0; k < groupServiceStatus.length; k++) {
                            if (groupServiceStatus[k]['pluginName'] === plugin) {
                                htmlData.groupServiceStatus.push(groupServiceStatus[k])
                                serviceNum--
                                if (serviceNum === 0) {
                                    delete pluginServiceNum[plugin]
                                    break
                                }
                            }
                        }
                        const data = render.renderImgData(htmlData)
                        const img = await puppeteer.cache('AppGroupServiceStatus',data)
                        msgs.push(img)
                        await sleep.sleep(1000)
                    }
                }
            } while (Object.keys(pluginServiceNum).length !== 0)
            let dsc
            if (allServiceStatus === 'on') {
                dsc = '对本群的所有服务已开启'
            } else if (allServiceStatus === 'off') {
                dsc = '对本群的所有服务已关闭（除必要的klee-cultivate-plugin.serviceStatus服务外）'
            } else {
                dsc = '本群的服务状态如下'
            }
            const msg = await this.makeForwardMsg(msgs,dsc)
            await this.reply(msg)
            return true
        }
        return true
    }
}

export { ServiceStatus }