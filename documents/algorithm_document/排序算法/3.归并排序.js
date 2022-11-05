function mergeSort (arr) {
    let array = mergeSortRec(arr)
    return array
}

// 数组分裂
function mergeSortRec(arr) {
    let length = arr.length
    if (length === 1) {
        return arr
    }
    let mid = Math.floor(length / 2)
    let left = arr.slice(0, mid)
    let right = arr.slice(mid, length)
    return merge(mergeSortRec(left), mergeSortRec(right))
}

// 有序合并
function merge(left, right) {
    let result = []
    while(left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    while(left.length) {
        result.push(left.shift())
    }
    while(right.length) {
        result.push(right.shift())
    }
    return result
}

let arr = [1, 3, 2, 5, 4]
console.log(mergeSort(arr)) // [1, 2, 3, 4, 5]