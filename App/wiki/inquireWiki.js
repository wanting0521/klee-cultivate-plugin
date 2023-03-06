import { XApp } from '../../Model/App/XApp.js'

class Wiki extends XApp {
    constructor() {
        super('Wiki', 'inquireWiki','简单查询原神百科','message')
    }

  /**
   * #原神*
   * @param e oicq传递的事件参数e
   */
  async ysWiki(e) {
    let name = e.msg.split('#原神')[1]
    await e.reply(`呐~${name}的百科页面\nhttps://wiki.biligame.com/ys/${encodeURI(name)}`)
   // await this.reply(this.e.msg)
  }
}
export { Wiki }