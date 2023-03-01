import { XApp } from '../../Model/App/XApp.js'
import { XPuppeteer } from '../../Model/Puppeteer/XPuppeteer.js'
import { XImgDataRender } from '../../Model/Render/XImgDataRender.js'

const puppeteer = new XPuppeteer()

/** 可莉帮助 */
class Help extends XApp {
    constructor() {
        super('klee','help','可莉插件帮助菜单','message')
    }

    async sendkleeHelp(e) {
        if (await this.canUseFnc(0)) {
            const render = new XImgDataRender('AppkleeHelp','kleeHelp')
            const data = render.renderImgData()
            const img = await puppeteer.cache('AppkleeHelp',data)
            await this.reply(img)
            return true
        }
        return true
    }
}

export { Help }