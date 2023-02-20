export {}
// 数字枚举
enum Day {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}
console.log(Day.SUNDAY) // 0

// 字符串枚举
enum message {
    Error = 'error',
    SUCCESS = 'success'
}

// 反向枚举(只支持数字枚举)
console.log(Day['MONDAY']) // 1
console.log(Day[1]) // MONDAY

// 异构枚举
enum Result {
    Faild = 0,
    Success = 'success'
}

// 常量枚举
const enum Animal {
    Dog,
    Cat
}



