export default {
    // 函数式组件，会导致render函数中没有this
    functional: true,
    props: {
        to: {
            type: String,
            required: true
        }
    },
    render(h, { props, slots, parent }) { // render 方法和 template等价的，template 语法需要被编译成render函数
        const click= () => {
            // 组件中的$router（由于没有this，需要获取parent的引用中获取）
            parent.$router.push(props.to)
        }
        // jsx 和 react 语法一样 < 开头表示的是html {}开头表示的是js属性
        return <a onClick={click}>{slots().default}</a>
    }
}