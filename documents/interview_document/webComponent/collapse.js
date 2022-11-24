class Collapse extends HTMLElement {
    constructor() {
        super()
        // 影子DOM
        const shadow = this.attachShadow({mode: 'open'})
        // 获取模板
        const tmpl = document.getElementById('collapse_tmpl')
        // 拷贝模板
        let cloneTemplate = tmpl.content.cloneNode(true)
        // 构造样式
        let style = document.createElement('style')
        // :host 代表的是影子的根元素
        style.textContent = `
            :host {
                width: 100%;
                display: flex;
                border: 1px solid #ebebeb;
                border-radius: 5px;
            }
            .well-collapse {
                width: 100%;
            }
        `
        // 将样式插入到影子DOM
        shadow.appendChild(style)
        // 模板插入到影子DOM
        shadow.appendChild(cloneTemplate)

        // 获取影子DOM中的插槽
        let slot = shadow.querySelector('slot')
        slot.addEventListener('slotchange', (e) => {
            // 获取所有插槽
            this.slotList = e.target.assignedElements()
            this.render()
        })

    }
    // 监听属性的变化
    static get observedAttributes () {
        return ['active']
    }
    // 属性变化钩子
    attributeChangedCallback(key, oldVal, newVal) {
        if (key === 'active') {
            this.activeList = JSON.parse(newVal)
            this.render()
        }
    }
    render() {
        if (this.slotList && this.activeList) {
           [...this.slotList].forEach(child => {
            child.setAttribute('active', JSON.stringify(this.activeList))
           })
        }
    }
    connectedCallback() {
        console.log('插入到dom时执行的回调')
    }
    disconnectedCallback() {
        console.log('移除dom时执行的回调')
    }
    adoptedCallback() {
        console.log('将组件移动到iframe会执行')
    }
}

export default Collapse