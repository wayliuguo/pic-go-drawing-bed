import Collapse from "./collapse.js"
import CollapseItem from "./collapse-item.js"

window.customElements.define('well-collapse', Collapse)
window.customElements.define('well-collapse-item', CollapseItem)


// 设置组件默认显示状态
let defaultActive = ['1', '2'] // name: 1 name:2 默认展开 3隐藏
document.querySelector('well-collapse').setAttribute('active', JSON.stringify(defaultActive))

// 自定义组件监听方法
document.querySelector('well-collapse').addEventListener('changeName', (e) => {
    let { isShow, name } = e.detail
    if (isShow) {
        let index = defaultActive.indexOf(name)
        defaultActive.splice(index, 1)
    } else {
        defaultActive.push(name)
    }
    document.querySelector('well-collapse').setAttribute('active', JSON.stringify(defaultActive))
})