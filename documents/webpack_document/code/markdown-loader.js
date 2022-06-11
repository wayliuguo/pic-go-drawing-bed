const marked = require('marked')
module.exports = source => {
    const html = marked.parse(source)
    // return `module.exports = ${JSON.stringify(html)}` 需要传回 js
    return html // 传回给 下一个loader处理
}