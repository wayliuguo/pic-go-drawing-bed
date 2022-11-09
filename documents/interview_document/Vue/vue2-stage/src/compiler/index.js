import { parserHTML } from './parser'
import { generate } from './generate'

export function compileToFunctions (template) {
    let root = parserHTML(template)
    console.log('>>>生成的AST语法树:', root)
    let code = generate(root)
    console.log('>>>生成的代码:', code)
    let render = `with(this){return ${code}}`
    let renderFn = new Function(render)
    return renderFn
}