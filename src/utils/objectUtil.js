/**
 * 深拷贝数组
 * @param target 目标数组
 * @param origin 目标数组
 * @param isChangeLength 是否需要向目标数组添加新元素
 * @return [*] 目标数组
 */
function copyElements(target, origin, isChangeLength = true) {
    // 传入参数不为数组类型 -> 结束函数
    if (!(target instanceof Array) || !(origin instanceof Array)) {
        return
    }
    let targetLength = target.length
    origin.forEach((item, index) => {
        if (item instanceof Object && item !== target[index]) {
            let obj = {}
            copyProperties(obj, item)
            target[index] = obj
        }
        if (isChangeLength && (index > targetLength - 1)) {
            target.push(item)
        } else {
            target[index] = item
        }
    })
    return target
}

/**
 * 深拷贝对象
 * @param target 目标对象
 * @param origin 目标对象
 * @param isNeedNewProperties 是否需要向目标对象添加新属性
 * @returns {*} 目标对象
 */
function copyProperties(target, origin, isNeedNewProperties = true) {
    let keys = Object.keys(origin)
    keys.forEach((key) => {
        if ((target[key] !== undefined && target[key] !== origin[key]) || isNeedNewProperties) {
            // 处理类型为数组的属性
            if (origin[key] instanceof Array) {
                target[key] = []
                copyElements(target[key], origin[key])
            }
            // 处理类型为对象的属性
            if (origin[key] instanceof Object) {
                target[key] = {}
                copyElements(target[key], origin[key])
            }
            // 基本数据类型
            target[key] = origin[key]
        }
    })
    return target
}

export {copyProperties, copyElements}