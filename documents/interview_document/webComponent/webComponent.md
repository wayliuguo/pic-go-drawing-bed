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

