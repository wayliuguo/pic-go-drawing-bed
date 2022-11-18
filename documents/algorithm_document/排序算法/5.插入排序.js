function insertSort(arr) {
    const len = arr.length
    // 由于第一个数组的第一个元素不需要排序，所以i从1开始
    for (let i=1; i<len; i++) {
        // 获取目标值
        let result = arr[i]
        // 待插入的坐标
        let resultIndex
        // 从i向前遍历，如果大于目标值，则后移一位
        for (resultIndex=i; resultIndex>0 && arr[resultIndex-1]>result; resultIndex--) {
            arr[resultIndex] = arr[resultIndex-1]
        }
        arr[resultIndex] = result
    }
    return arr
}

const arr = [8,0,4,6,1,2,7,3,5,9]
console.log(insertSort(arr)) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]