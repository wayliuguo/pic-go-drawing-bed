function bubbleSort(arr) {
    for (let i=0; i<arr.length; i++) {
        // 提前退出冒泡循环的标识位
        let flag = false
        for(let j=0; j<arr.length-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
                flag = true
            }
        }
        if (!flag) break
    }
    return arr
}

const arr = [8,0,4,6,1,2,7,3,5,9]
console.log(bubbleSort(arr)) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]