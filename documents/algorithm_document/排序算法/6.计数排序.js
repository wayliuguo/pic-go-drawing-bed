function countingSort (arr) {
    // 获取出现的最大元素
    let max = arr[0]
    for (let i=1; i<arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i]
        }
    }
    // 创建一个新数组，用来统计数组中每个元素出现的次数
    let mapArr = new Array(max + 1)
    // 遍历数组，把每个元素出现的次数记录在新数组的相应位置
    for (let i=0; i<arr.length; i++) {
        // 如果元素未出现过，则置1
        if (!mapArr[arr[i]]) {
            mapArr[arr[i]] = 1
        } else {
            // 已经出现过的元素次数+1
            mapArr[arr[i]]++
        }
    }
    // 排序数组的下标
    let startIndex = 0
    // 遍历新数组，依次取出元素
    for (let j=0; j<arr.length; j++) {
        while(mapArr[j] > 0) {
            arr[startIndex] = j
            // 对应元素次数 - 1
            mapArr[j]--
            // 排序数组下表 + 1
            startIndex++
        }
    }
    return arr
}

const arr = [8,0,4,6,1,2,7,3,5,9]
console.log(countingSort(arr)) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]