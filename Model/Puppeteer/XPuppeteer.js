import { klee } from '../klee.js'
import { XLog } from '../Log/XLog.js'
import { XDir } from '../Dir/XDir.js'
import cfg from '../../../../lib/config/config.js'
import lodash from 'lodash'
import fs from 'fs'
import path from 'path'
import template from 'art-template'
import chalk from 'chalk'
import { segment } from 'oicq'
import md5 from 'md5'

const log = new XLog()
const dir = new XDir()

/** 浏览器截图类 */
class XPuppeteer extends klee {
    browser
    lock
    shoting
    restartNum
    renderNum
    config
    html
    puppeteer = {}

    constructor() {
        super()
        this.browser = false
        this.lock = false
        this.shoting = []
        /** 截图数达到时重启浏览器，避免生成速度越来越慢 */
        this.restartNum = 400
        /** 截图次数 */
        this.renderNum = 0
        this.config = {
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process'
            ],
            executablePath: ''
        }
        if (cfg.bot['chromium_path']) {
            /** chromium其他路径 */
            this.config.executablePath = cfg.bot['chromium_path']
        }
        this.html = {}
    }

    /**
     * 初始化puppeteer
     */
    async initXlsx() {
        if (!lodash.isEmpty(this.puppeteer)) {
            return this.puppeteer
        }
        this.puppeteer = (await import('puppeteer')).default
    }

    /**
     * 初始化chromium
     */
    async initBrowser() {
        await this.initXlsx()
        if (this.browser) {
            return this.browser
        }
        if (this.lock) {
            return false
        }
        this.lock = true
        log.mark('puppeteer Chromium 启动中...')
        this.browser = await this.puppeteer.launch(this.config).catch(err => {
            log.error(err)
            if (String(err).includes('correct Chromium')) {
                log.error('没有正确安装Chromium，可以尝试执行安装命令：node ./node_modules/puppeteer/install.js')
            }
        })
        this.lock = false
        if (!this.browser) {
            log.error('puppteer Chromium 启动失败')
            return false
        }
        log.mark('puppeteer Chromium 启动成功')
        /** 监听Chromium实例是否断开 */
        this.browser.on('disconnected',() => {
            log.error('Chromium实例关闭或崩溃！')
            this.browser = false
        })
        return this.browser
    }

    /**
     * chromium截图
     * @param name { String } 模块名
     * @param param 模板参数
     * @param param.tplFile { String } 模板绝对路径，必传
     * @param param.saveId { String } 生成的html名称，为空则用name代替
     * @param param.imgType { String } 生成图片的类型：jpeg，png
     * @param param.quality { Number } 图片质量 0-100，jpeg是可传，默认90
     * @param param.omitBackground { Boolean } 隐藏默认的白色背景，背景透明。默认不透明
     * @param param.path { String } 截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
     */
    async screenshot(name, param = {}) {
        if (!await this.initBrowser()) {
            return false
        }
        const savePath = this.dealTpl(name, param)
        if (!savePath) {
            return false
        }
        let buff
        const start = Date.now()
        try {
            this.shoting.push(name)
            const page = await this.browser.newPage()
            await page.goto(`file://${process.cwd()}${lodash.trim(savePath, '.')}`)
            const body = await page.$('#container') || await page.$('body')
            const randData = {
                type: param.imgType || 'jpeg',
                omitBackground: param.omitBackground || false,
                quality: param.quality || 90,
                path: param.path || ''
            }
            if (param.imgType === 'png') {
                delete randData.quality
            }
            buff = await body.screenshot(randData)
            page.close().catch(err => log.error(err))
            this.shoting.pop()
        } catch (e) {
            log.error(`图片生成失败:${name}:${e}`)
            /** 关闭浏览器 */
            if (this.browser) {
                await this.browser.close().catch(err => log.error(err))
            }
            this.browser = false
            return false
        }
        if (!buff) {
            log.error(`图片生成为空:${name}`)
            return false
        }
        this.renderNum++
        /** 计算图片大小 */
        let kb = (buff.length / 1024).toFixed(2) + 'kb'
        log.mark(`[图片生成][${name}][${this.renderNum}次] ${kb} ${chalk.green(`${Date.now() - start}ms`)}`)
        this.restart()
        return segment.image(buff)
    }

    /**
     * 处理html模板
     * @param name { String } 模块名
     * @param param 模板参数
     * @return { null,String }
     */
    dealTpl(name, param) {
        const { htmlPath, saveId = name } = param
        const HtmlResPath = './plugins/kleePlugin/Data/Html'
        const savePath = `${HtmlResPath}/${name}/${saveId}.html`
        /** 读取html模板 */
        dir.mkDirsSync(`${HtmlResPath}/${name}`)
        try {
            this.html[htmlPath] = fs.readFileSync(htmlPath, 'utf8')
        } catch (e) {
            log.error(`加载html错误：${htmlPath}`)
            return null
        }
        param.resPath = path.join(this.kleeRootAbsPath,'Resource')
        /** 替换模板 */
        const tmpHtml = template.render(this.html[htmlPath], param)
        /** 保存模板 */
        fs.writeFileSync(savePath, tmpHtml)
        log.mark(`[图片生成][使用模板][${savePath}]`)
        return savePath
    }

    /**
     * 重启
     */
    restart() {
        /** 截图超过重启数时，自动关闭重启浏览器，避免生成速度越来越慢 */
        if (this.shoting.length <= 0) {
            setTimeout(async () => {
                this.browser.removeAllListeners('disconnected')
                await this.browser.close().catch(err => log.error(err))
                this.browser = false
                log.mark('puppeteer关闭重启')
            }, 100)
        }
    }

    /**
     * 制作图片
     * @param name { String } 模块名
     * @param data html数据
     */
    async cache (name, data) {
        let htmlData = {
            md5: '',
            img: ''
        }
        let tmp = md5(JSON.stringify(data))
        if (htmlData.md5 === tmp) {
            return htmlData.img
        }
        htmlData.img = await this.screenshot(name, data)
        htmlData.md5 = tmp
        return htmlData.img
    }
}

export { XPuppeteer }