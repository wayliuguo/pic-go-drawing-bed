import { parserHTML } from './parser'
import { generate } from './generate'

export function compileToFunctions (template) {
    
    let root = parserHTML(template)
    console.log(root)
    let code = generate(root)
    console.log(code)
}