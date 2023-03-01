interface Bird {
    swing: number // 2: 两个翅膀
}
interface Dog {
    leg: number // 4：四条腿
}
function isBird(x: Bird | Dog): x is Bird {
    return (x as Bird).swing === 2
}

function getAnimal(x: Bird | Dog) {
    if (isBird(x)) {
        console.log(x) // (parameter) x: Bird
    } else {
        console.log(x) // (parameter) x: Dog
    }
}