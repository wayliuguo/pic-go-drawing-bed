export function isFunction (val) {
    return typeof val === 'function'
}

export function isObject (val) {
    return typeof val === 'object' && val !== null
}

export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]

const starts = {}
function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}
LIFECYCLE_HOOKS.forEach(hook => {
    starts[hook] = mergeHook
})

starts.components = function (parentVal, childVal) {
    let options = Object.create(parentVal)
    if (childVal) {
        for (let key in childVal) {
            options[key] = childVal[key]
        }
    }
    return options
}

export function mergeOptions(parent, child) {
    // 合并后的结果
    const options = {}
    for (let key in parent) {
        mergeFiled(key)
    }
    for (let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeFiled(key)
        }
    }
    function mergeFiled(key) {
        // 使用策略模式处理钩子
        if (starts[key]) {
            options[key] = starts[key](parent[key], child[key])
        } else {
            if (isObject(parent[key]) && isObject(child[key])) {
                options[key] = {
                    ...parent[key],
                    ...child[key]
                }
            } else {
                options[key] = child[key] || parent[key]
            }
        }
    }
    return options
}


function makeMap(str) {
    const map = {}
    const list = str.split(',')
    for (let i=0; i<list.length; i++) {
        map[list[i]] = true
    }
    return (key) => map[key]
}

export const isReservedTag = makeMap(
    'a,div,img,image,text,span,input,p,button,ul,li'
)