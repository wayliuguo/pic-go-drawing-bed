export function patch(oldVnode, vnode) {
    // 判断是要要跟新还是要渲染
    if (!oldVnode) {
        return createElm(vnode)
    }
    // 如果是元素
    if (oldVnode.nodeType === 1) {
        // 用vnode来生成真实dom，替换成原来的dom元素

        // 找到其父亲元素
        const parentElm = oldVnode.parentNode
        // 根据虚拟节点创建元素
        let elm = createElm(vnode)
        parentElm.insertBefore(elm, oldVnode.nextSibling)
        // 把自己删除
        parentElm.removeChild(oldVnode)
        return elm
    } else {
        // 如果标签名称不一样， 直接删掉老的换成新的即可
        if (oldVnode.tag !== vnode.tag) {
            // 可以通过vnode.el 属性，获取现在真实的dom元素
           return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
        
        }
        // 新节点复用老节点
        let el = vnode.el = oldVnode.el

        // 如果两个虚拟节点是文本节点（比较文本内容）
        if (vnode.tag === undefined) {
            if (oldVnode.text !== vnode.text) {
                el.textContent = vnode.text
            }
            return
        }

        // 如果标签一样比较属性，用新的属性更新老的(目前data的值还有bug)
        updateProperties(vnode, oldVnode.data)

        // 一方有儿子 一方没儿子
        let oldChildren = oldVnode.children || []
        let newChildren = vnode.children || []
        if (oldChildren.length > 0 && newChildren.length > 0) {
            // 如果双方都有儿子
            // vue 使用了双指针的方式来对比
            patchChildren(el, oldChildren, newChildren)
        } else if (newChildren.length > 0) {
            // 老的没儿子，但是新的有儿子
            // 循环创建新节点
            for (let i=0; i < newChildren.length; i++) {
                let child = createElm(newChildren[i])
                el.appendChild(child)
            }
        } else if (oldChildren.length > 0) {
            // 老的有儿子新的没儿子(bug: 属性还是会保留新属性)
            // 直接删除老节点
            el.innerHTML = ``
        }
        return el
    }
}

function patchChildren(el, oldChildren, newChildren) {
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[0]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]

    const makeIndexByKey = (children) => {
        return children.reduce((memo, current, index) => {
            if (current.key) {
                memo[current.key] = index
            }
            return memo
        }, {})
    }
    const keysMap = makeIndexByKey(oldChildren)

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 如果节点已经被暴力比对给移走，则指针继续移动
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex]
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]
        }
        // 同时循环新节点和老节点，有一方循环完毕就结束了
        // 头头比较，标签一致
        if (isSameVnode(oldStartVnode, newStartVnode)) {
            // 递归比较
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            // 尾尾比较
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // 头尾比较=》reverse
            patch(oldStartVnode, newEndVnode)
            // 把旧头节点插入到旧尾节点下一个节点
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // 尾头比较=》reverse
            patch(oldEndVnode, newStartVnode)
            // 把旧尾节点插入到旧头节点
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else {
            // 乱序对比
            // 需要根据key和对应的索引的内容生成映射表
            // 通过新头的key找出对应旧的key所对应的index
            let moveIndex = keysMap[newStartVnode.key]
            // 如果不能复用，直接创建新的插入到老的节点节点开头处
            if (moveIndex == undefined) {
                el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
            } else {
                let moveNode = oldChildren[moveIndex]
                // 此节点已经被移走了
                oldChildren[moveIndex] = null
                // 移动节点
                el.insertBefore(moveNode.el, oldStartVnode.el)
                // 比较两个节点的属性
                patch(moveNode, newStartVnode)
            }
            newStartVnode = newChildren[++newStartIndex]
        }

    }
    // 这里是用户没有比对完的
    // 这是新的还没有比对完（旧的已经比对完了，新的还有）
    if (newStartIndex <= newEndIndex) {
        for (let i= newStartIndex; i <= newEndIndex; i++) {
            // el.appendChild(createElm(newChildren[i]))

            // 通过判断尾指针得下一个元素是否存在判断是从头比较还是从尾比较
            // 如果是从头比较则appendChild即可，如果是从尾比较则通过insertBefore (appendChild 等价于 insertBefore(newItem, null))
            let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
            el.insertBefore(createElm(newChildren[i]), anchor)
        }
    }
    // 这是旧还没有比对完（新的已经比对完了，旧的还有）
    if (oldStartIndex <= oldEndIndex) {
        for (let i=oldStartIndex; i<=oldEndIndex; i++) {
            // 如果老的多 将老节点删除 但可能有暴力对比移除掉null的情况
            if (oldChildren[i] !== null) {
                el.removeChild(oldChildren[i].el)
            }
        }
    }
}

function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key
}

export function createElm (vnode) {
    let { tag, data, children, text, vm } = vnode
    // 如果是元素
    if (typeof tag ==='string') {
        if (createComponent(vnode)) {
            // 返回组件对应的真实节点
            return vnode.componentInstance.$el
        }
        // 虚拟节点会有一个el属性，对应真实节点
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function createComponent (vnode) {
    let i = vnode.data
    if ((i=i.hook) && (i = i.init)) {
        // 调用init方法
        i(vnode)
    }
    if (vnode.componentInstance) {
        return true
    }
}

function updateProperties(vnode, oldProps={}) {
    let newProps = vnode.data || {}
    // 当前真实节点
    let el = vnode.el

    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    // 去除老的style中新的没有的
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }

    // 如果老的属性有，新的没有直接删除
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    for (let key in newProps) {
        // 如果是有style属性
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}