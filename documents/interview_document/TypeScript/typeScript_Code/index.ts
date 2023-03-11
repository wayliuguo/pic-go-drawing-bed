// 普通声明
declare let age: number
declare function getName(): string
declare class Animal{}

// 外部枚举
declare enum Seasons {
    Spring,
    Summer,
    Autumn,
    Winter
}
let seasons = {
    spring: Seasons.Spring
}

declare namespace $ {
    function ajax(url: string, settings: any): void
    let name: string
    namespace fn {
        function extend(obj: any): void
    }
}
$.ajax('/get', {})
$.name
$.fn.extend({})