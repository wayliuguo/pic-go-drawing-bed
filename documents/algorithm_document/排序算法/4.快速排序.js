function quickSort (arr) {
    if (arr.length <= 1) return arr
    // 基准索引
    let middleIndex = Math.floor(arr.length / 2)
    // 基准值
    let middleValue = arr[middleIndex]
    // 建立一个左数组
    let left = []
    // 建立一个右数组
    let right = []
    // 遍历数组
    for (let i=0; i<arr.length; i++) {
        if (i === middleIndex) continue
        if (arr[i] < middleValue) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    // 递归： 左 基准 右
    return quickSort(left).concat([middleValue], quickSort(right))
}

const arr = [8,0,4,6,1,2,7,3,5,9]
console.log(quickSort(arr)) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]