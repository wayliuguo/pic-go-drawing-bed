function mergeSort (arr) {
    // 如果数组长度为一，则终止递归
    if (arr.length === 1) return arr
    let left = []
    let right = []
    let middle = Math.floor(arr.length / 2)
    // 拆分数组
    for (let i=0; i<arr.length; i++) {
        if (i < middle) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }
    // 将数组拆分到单元素才开始合并
    return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
    let result = []
    let l = 0
    let r = 0
    // 根据left、right中元素的大小进行排序
    while (l < left.length && r < right.length) {
        // 如果 左<右
        if (left[l] < right[r]) {
            result.push(left[l])
            l++
        } else {
            // 如果 右<= 左
            result.push(right[r])
            r++
        }
    }
    // 如果 left 数组未处理完毕（right数组肯定已空）
    while (l < left.length) {
        result.push(left[l])
        l++
    }
    // 如果 right 数组未处理完毕（left数组肯定已空）
    while (r < right.length) {
        result.push(right[r])
        r++
    }
    return result
}

const arr = [8,0,4,6,1,2,7,3,5,9]
console.log(mergeSort(arr))
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]