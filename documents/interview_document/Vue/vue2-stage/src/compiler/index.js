// 匹配标签名 div
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// 获取获取标签名的 match 数组索引为1的: div
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
/* let r = '<div></div>'.match(new RegExp(qnameCapture))
console.log(r) // [ 'div', 'div', index: 1, input: '<div></div>', groups: undefined ] */

// 匹配开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配闭合标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

// 匹配属性 a=b a="b" a='b'
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
//  />
const startTagClose = /^\s*(\/?)>/
// {{name}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// html 字符串解析成对应的脚本来触发 tokens <div id="app">{{name}}</div>

function start (tagName, attributes) {
    console.log(tagName, attributes)
}
function end (tagName) {
    console.log(tagName)
}
function chars(text) {
    console.log(text)
}
function parserHTML(html) { // <div id="app">{{name}}</div>
    // 截取字符串
    function advance (len) {
        html = html.substring(len)
    }
    // 匹配标签开头
    function parseStartTag () {
        const start = html.match(startTagOpen)
        // console.log(start) // ['<div', 'div']
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            // console.log(html) // id="app">{{name}}</div>
            let end,attr
            // 如果没有遇到标签结尾就不停的解析
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr) // [' id="app"', 'id', '=', 'app', undefined, undefined]
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                /* console.log(match)
                {
                    tagName: 'div',
                    attrs: [
                        {
                            name: 'id',
                            value: 'app'
                        }
                    ]

                } */
                // console.log(html) // >{{name}}</div>
            }
            if (end) {
                // console.log(end)
                // ['>', '']
                advance(end[0].length)
                return match
            }

        }
        // 不是开始标签
        return false 
    }
    
    // 解析的内容如果存在则不停地解析
    while (html) {
        // 当前解析的开头
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            const startTagMatch = parseStartTag(html)
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue
            }
        }
        // 处理文本
        let text // {{name}}</div>
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            chars(text)
            advance(text.length)
        }
    }
}
export function compileToFunctions (template) {
    
    parserHTML(template)
}