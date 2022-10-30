import babel from 'rollup-plugin-babel'

export default {
    input: './src/index.js', // 入口
    output: {
        format: 'umd', // 支持amd 和 commonjs 规范
        name: 'Vue', // window.Vue
        file: 'dist/vue.js',
        sourcemap: true
    },
    pulgins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
}