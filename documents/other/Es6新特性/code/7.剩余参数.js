function foo () {
    console.log(arguments) // 伪数组
    // [Arguments] { '0': 1, '1': 2, '2': 3, '3': 4 }
    console.log(arguments[0]) // 1
}

function face (first, ...args) {
    console.log(args) // [ 2, 3, 4 ]
} 

foo(1,2,3,4)
face(1,2,3,4)