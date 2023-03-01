import { klee } from '../klee.js'
import moment from 'moment'

/** 时间类 */
class XTime extends klee {
    constructor() {
        super()
    }

    /**
     * 获取年、月、日、时、分和秒六个对象（针对Date对象）
     * @param time { Date }
     * @return {{ year: Number,month: Number,day: Number,hour: Number,minute: Number,second: Number }}
     */
    getTimeObjectFromDateObject(time) {
        return {
            year: time.getFullYear(),
            month: time.getMonth() + 1,
            day: time.getDate(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds()
        }
    }

    /**
     * 根据时间戳获取年、月、日、时、分和秒六个对象
     * @param time { Number } 时间戳
     * @return {{ year: Number,month: Number,day: Number,hour: Number,minute: Number,second: Number }}
     */
    getTime(time) {
        const momentTime = moment(time)
        const year = momentTime.get('year')
        const month = momentTime.get('month') + 1
        const day = momentTime.get('date')
        const hour = momentTime.get('hours')
        const minute = momentTime.get('minutes')
        const second = momentTime.get('seconds')
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second
        }
    }

    /**
     * 获取当前时间（年、月、日、时、分和秒六个对象）
     * @return {{ year: Number,month: Number,day: Number,hour: Number,minute: Number,second: Number }}
     */
    getCurrentTime() {
        const currentTime = moment()
        const year = currentTime.get('year')
        const month = currentTime.get('month') + 1
        const day = currentTime.get('date')
        const hour = currentTime.get('hours')
        const minute = currentTime.get('minutes')
        const second = currentTime.get('seconds')
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second
        }
    }

    /**
     * 计算两个时间的时间差（Date对象操作）
     * @param startTime { Date } 开始时间
     * @param endTime { Date }} 结束时间
     * @return {{ day: Number,hour: Number,minute: Number,second: Number}}
     */
    calculateTimeDifference(startTime,endTime) {
        let time = {
            day: 0,
            hour: 0,
            minute: 0,
            second: 0
        }
        let milliseconds = endTime.getTime() - startTime.getTime()
        time.day = Math.floor(milliseconds / (24 * 60 * 60 * 1000))
        milliseconds %= 24 * 60 * 60 * 1000
        time.hour = Math.floor(milliseconds / (60 * 60 * 1000))
        milliseconds %= 60 * 60 * 1000
        time.minute = Math.floor(milliseconds / (60 * 1000))
        milliseconds %= 60 * 1000
        time.second = Math.round(milliseconds / 1000)
        return time
    }

    /**
     * 加减秒（对时、分和秒三个对象操作）
     * @param time {{ hour: Number,minute: Number,second: Number }} 时间对象
     * @param value { Number }要改变的秒数，负数代表减
     * @return {{ hour: Number,minute: Number,second: Number }}
     */
    setSecond(time,value) {
        time.second += value
        if (time.second >= 60) {
            time.minute += 1
            time.second -= 60
            if (time.minute === 60) {
                time.hour += 1
                time.minute = 0
                if (time.hour === 24) {
                    time.hour = 0
                }
            }
        }
        if (time.second < 0) {
            time.minute -= 1
            time.second += 60
            if (time.minute === -1) {
                time.hour -= 1
                time.minute = 59
                if (time.hour === -1) {
                    time.hour = 23
                }
            }
        }
        return time
    }



    /**
     * 将形如 06:02:38 转换为时、分和秒三个对象
     * @param time { String } hh:mm:ss
     * @returns { null,{hour: Number,minute: Number,second: Number} }
     */
    getTimeObject(time) {
        const reg = new RegExp(/^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/)
        if (reg.test(time)) {
            const times = time.split(':')
            let hour = Number(times[0])
            let minute = Number(times[1])
            let second = Number(times[2])
            if (hour >= 24 || minute >= 60 || second >= 60) {
                return null
            }
            return {
                hour,
                minute,
                second
            }
        }
        return null
    }
}

export { XTime }