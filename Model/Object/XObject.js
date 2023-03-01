import { klee } from '../klee.js'
import lodash from 'lodash'

/** 对象类 */
class XObject extends klee {
    constructor() {
        super()
    }

    /**
     * 合并两个对象（前面对象相同的属性将被后面的对象替换）
     * @param obj1
     * @param obj2
     */
    mergeObject(obj1,obj2) {
        if (typeof obj2 !== 'object') {
            return false
        } else {
            if (lodash.isArray(obj2)) {
                return false
            } else {
                for (const obj2Key in obj2) {
                    if (obj2.hasOwnProperty(obj2Key)) {
                        if (obj1.hasOwnProperty(obj2Key)) {
                            if (!this.mergeObject(obj1[obj2Key],obj2[obj2Key])) {
                                obj1[obj2Key] = obj2[obj2Key]
                            }
                        } else {
                            obj1[obj2Key] = obj2[obj2Key]
                        }
                    }
                }
                return true
            }
        }
    }

    /**
     * 对象的深拷贝
     * @param newObj 新对象
     * @param oldObj 旧对象
     */
    deepCopy(newObj, oldObj) {
        for (let k in oldObj) {
            if (oldObj.hasOwnProperty(k)) {
                let item = oldObj[k]
                if (item instanceof Array) {
                    newObj[k] = []
                    this.deepCopy(newObj[k], item)
                } else if (item instanceof Object) {
                    newObj[k] = {}
                    this.deepCopy(newObj[k], item)
                } else {
                    newObj[k] = item
                }
            }
        }
    }
}

export { XObject }