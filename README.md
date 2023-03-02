# kleePlugin（可莉）
云崽 [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot) 插件，正在逐渐开发

---
| 模块 | 有关功能 | 模块介绍 |
|:---:|:---:|:---:|
| Bot | Work、Status | 对机器人进行操作 |
| Expand | MyExpand | 拓展包（用户自己开发的功能） |
| klee | Help | 对可莉插件进行操作 |
---
| 功能 | 方法 | 触发指令 | 方法介绍 |
|:---:|:---:|:---:|:---|
| Work | dealMsg | - | 监听消息，视工作状态决定是否处理 |
| Work | viewWorkStatus | #?查看工作情况 | 查看可莉工作状态和工作时间 |
| Work | startWork | #?可莉开始工作 | 让机器人处理消息 |
| Work | endWork | #?可莉结束工作 | 让机器人不处理消息 |
| Work | openTimedWork | #?开启定时工作 | 让机器人定时休息和工作 |
| Work | endTimedWork | #?关闭定时工作 | 不让机器人定时休息和工作 |
| Status | setBotName | #?设置名字(.)* | 给机器人取个名字 |
| Status | viewBotIDCard | #?机器人身份证 | 查看机器人的身份证信息 |
| Group | openAllService | #?开启所有服务 | 对本群开启所有服务 |
| Group | closeAllService | #?关闭所有服务 | 对本群关闭所有服务 |
| Group | addAgent | #?添加代理人\[0-9]+ | 添加群友为机器人的代理人 |
| Group | delAgent | #?删除代理人\[0-9]+ | 取消群友的机器人代理人资格 |
| Group | viewServiceStatus | #?查看服务状态 | 查看群聊中所有服务的状态 |
| Group | openService | #?开启(.)+服务 | 对本群开启某服务 |
| Group | closeService | #?关闭(.)+服务 | 对本群关闭某服务 |
| Group | viewAgents | #?本群代理人 | 查看本群的所有代理人 |
| Group | viewAllServices | #?查看所有服务 | 查看已安装的所有服务 |
---

## 使用指南
### 1.进入云崽根目录
```
cd Yunzai-Bot
```
### 2.下载可莉最新版本（目前只在gitee上有）
```
git clone https://gitee.com/j-k-komel/klee-cultivate-plugin.git ./plugins/klee-cultivate-plugin/

```
### 3.进入可莉根目录
```
cd ./plugins/klee-cultivate-plugin
```
<!-- ### 4.安装可莉依赖（目前不需要~）
```
pnpm install -P
``` -->
<!-- ## 帮助文档（目前正在建设中~） -->
<!-- [可莉插件使用帮助](https://docs.qq.com/doc/DZERCSERCZ09PdEl0) -->

## 拓展库（暂无）
| 拓展 | 作者 | 说明 | 

## 作者QQ群（未满可加~）
1063837198