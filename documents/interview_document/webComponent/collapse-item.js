class CollapseItem extends HTMLElement {
    constructor() {
        super()
        // 影子DOM
        const shadow = this.attachShadow({mode: 'open'})
        // 获取模板
        const tmpl = document.getElementById('collapse_item_tmpl')
        // 拷贝模板
        let cloneTemplate = tmpl.content.cloneNode(true)
        // 构造样式
        let style = document.createElement('style')
        // 是否显示
        this.isShow = true
        // :host 代表的是影子的根元素
        style.textContent = `
            :host: {
                width: 100%;
            }
            .title {
                background: #f1f1f1;
                line-height: 35px;
                height: 35px;
            }
            .content {
                font-size: 14px;
            }
        `
        // 将样式插入到影子DOM
        shadow.appendChild(style)
        // 模板插入到影子DOM
        shadow.appendChild(cloneTemplate)

        // 获取title元素
        this.titleEle = shadow.querySelector('.title')
        // 给title绑定事件
        this.titleEle.addEventListener('click', () => {
            // 如何将结果传递给父亲 组件通信
            document.querySelector('well-collapse').dispatchEvent(new CustomEvent('changeName', {
                detail: {
                    name: this.getAttribute('name'),
                    isShow: this.isShow
                }
            }))
        })
    }
    // 监听属性的变化
    static get observedAttributes () {
        return ['active', 'title', 'name']
    }
    // 属性变化钩子
    attributeChangedCallback(key, oldVal, newVal) {
        switch (key) {
            case 'active':
                this.activeList = JSON.parse(newVal)
                break
            case 'title':
                this.titleEle.innerHTML = newVal
                break
            case 'name':
                this.name = newVal
                break
        }
        let name = this.name
        if (this.activeList && name) {
            this.isShow = this.activeList.includes(name)
            this.shadowRoot.querySelector('.content').style.display = this.isShow ? 'block' : 'none'
        }

    }
}

export default CollapseItem