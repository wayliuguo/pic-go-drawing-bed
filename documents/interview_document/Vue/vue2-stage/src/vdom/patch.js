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
    }
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