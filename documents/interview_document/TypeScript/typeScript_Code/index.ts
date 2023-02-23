interface Books {
    name: string
}
interface Cateory {
    cateory: string
}
interface Money {
    price: string
}
interface MathBook extends Books, Cateory, Money {
    range: string
}
const myMathBook: MathBook = {
    range: "上学期",
    name: "数学书",
    cateory: "教材",
    price: "55"
}