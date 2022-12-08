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
    }
}

function createElm (vnode) {
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

function updateProperties(vnode) {
    let newProps = vnode.data || {}
    // 当前真实节点
    let el = vnode.el
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