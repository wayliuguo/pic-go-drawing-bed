import { parserHTML } from './parser'

export function compileToFunctions (template) {
    
    let root = parserHTML(template)
    console.log(root)
}