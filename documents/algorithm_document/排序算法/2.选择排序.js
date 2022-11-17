function selectionSort (arr) {
    let index
    for (let i=0; i<arr.length; i++) {
        index = i
        for(let j=i; j<arr.length; j++) {
            if (arr[index] < arr[j]) {
                index = j
            }
        }
        if (i !== index) {
            [arr[index], arr[i]] = [arr[i], arr[index]]
        }
        console.log(arr)
        /* [ 1, 3, 2, 5, 4 ]
           [ 1, 2, 3, 5, 4 ]
           [ 1, 2, 3, 5, 4 ]
           [ 1, 2, 3, 4, 5 ]
           [ 1, 2, 3, 4, 5 ] */
    }
}

let arr = [1, 3, 2, 5, 4]
selectionSort(arr)
console.log(arr) // [1, 2, 3, 4, 5]