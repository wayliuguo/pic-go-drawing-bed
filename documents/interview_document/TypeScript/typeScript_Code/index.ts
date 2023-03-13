// 命名空间扩展类
class Form {
    username: Form.Item = ''
    password: Form.Item = ''
}
namespace Form {
    export class Item{}
}
let item: Form.Item = new Form.Item()

// 命名空间扩展方法
function hello() {}
namespace hello {
    export let words = 'words'
}
console.log(hello.words) // words

// 命名空间扩展枚举类型
enum Color {
    red = 1,
    yellow = 2
}
namespace Color {
    export const green = 3
}
console.log(Color.green) // 3
