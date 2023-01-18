function radixSort(arr) {
    // 在数组中找最大值
    let max = arr[0]
    for (let i=0; i<arr.length; i++) {
        if (max < arr[i]) {
            max = arr[i]
        }
    }
    // 获取最大值的位数，如： 10 两位数 100 三位数
    let digits = `${max}`.length
    // 根据位数来决定循环次数
    for (let i=0; i<digits; i++) {
        sort(arr, i)
    }
    return arr
}

function sort(arr, round) {
    // 创建一个元素容器（桶）
    let result = []
    // 根据位数创建对应的桶
    for (let i=0; i<10; i++) {
        result[i] = []
    }
    // 将数组中的数放进对应的桶子中
    for(let i=0; i<arr.length; i++) {
        let middle = arr[i] / (Math.pow(10, round))
        // 得到目标桶的坐标
        let index = Math.floor(middle % 10)
        // 把元素放入到对应的桶中
        result[index].push(arr[i])
    }
    let index = 0
    // 在桶中将元素取出，放入原数组
    for(let i=0; i<result.length; i++) {
        for(let j=0; j<result[i].length; j++) {
            // 从每个桶中取出元素
            arr[index++] = result[i][j]
        }
    }
}

const arr = [10,5,5,50,0,155,422,5,1,4,254]
console.log(radixSort(arr))