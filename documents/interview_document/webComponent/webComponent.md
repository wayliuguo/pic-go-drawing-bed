## 1.优缺点

- 优点：原生组件，不需要框架，性能好代码少
- 缺点：兼容性问题

## 2.核心三项技术

- Custom elements: 一组JavaScript API，允许您定义 custom elements及其行为，然后可以在您的用户界面中按照需要使用他们
- Shadow DOM:一组JavaScript API，用于将封装的“影子”DOM树附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样他们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突
- HTML templates: `<template>` 和 `<slot>`使您可以编写不在呈现页面中的标记模板。然后他们可以作为自定义元素结构的基础被多次重用。
- HTML templates:

```
<well-button type="primary">
	wellButton
</well-button>

<template id="btn">
    <button class="well-btn">
    	<slot>按钮</slot>
    </button>
</template>
```

template 中的内容是我们定义的button组件的样子。slot可以获取自定义组件中的内容，插入到模板对应位置。

- shadowDOM

```
<body>
    <script>
        class wellButton extends HTMLElement {
            constructor() {
                super()
                // 创建影子
                let shadow = this.attachShadow({mode: 'open'})
                let btn = document.getElementById('btn')
                // 拷贝模板
                let cloneTemplate = btn.content.cloneNode(true)
                const style = document.createElement('style')
                const types = {
                    'primary': {
                        backgroundColor: '#409eff',
                        color: '#fff'
                    },
                    'default': {
                        backgroundColor: '#c8c9cc',
                        color: '#fff'
                    }
                }
                // 获取组件type属性
                const btnType = this.getAttribute('type') || 'default'
                // 设置样式
                style.innerHTML = `
                    .well-btn {
                        outline: none;
                        border: none;
                        border-radius: 4px;
                        display: inline-block;
                        cursor: pointer;
                        padding: 6px 20px;
                        background: var(--background-color, ${types[btnType].backgroundColor});
                        color: var(--text-color, ${types[btnType].color})
                    }
                `
                shadow.appendChild(style)
                shadow.appendChild(cloneTemplate)
            }
        }
        // 自定义组件
        window.customElements.define('well-button', wellButton)
    </script>
</body>
</html>
```

通过实现HTMLElement接口，同时绑定shadow DOM 实现隔离机制，然后操作样式，最后把shadow通过appendChild到模板上。

```
<style>
    :root {
        --background-color: yellow;
        --text-color: black;
    }
</style>
```

如果需要换肤，则可以配合css3的var 实现

## 3.collapse 组件

- collapse.html

  ```
  <body>
      <well-collapse>
          <well-collapse-item title="Node" name="1">
              <div>nodejs welcome</div>
          </well-collapse-item>
          <well-collapse-item title="Vue" name="2">
              <div>Vue welcome</div>
          </well-collapse-item>
          <well-collapse-item title="react" name="3">
              <div>react welcome</div>
          </well-collapse-item>
      </well-collapse>
  
      <template id="collapse_tmpl">
          <div class="well-collapse">
              <slot></slot>
          </div>
      </template>
      <template id="collapse_item_tmpl">
          <div class="well-collapse-item">
              <div class="title">
              </div>
              <div class="content">
                  <slot></slot>
              </div>
          </div>
      </template>
  
      <script src="./index.js" type="module"></script>
  </body>
  </html>
  ```

- index.js

  ```
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
  ```

- collapse.js

  ```
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
  ```

- collpase-item.js

  ```
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
  ```

  
