function selectionSort (arr) {
    let index
    for (let i=0; i<arr.length; i++) {
        index = i
        for(let j=i+1; j<arr.length; j++) {
            if (arr[index] < arr[j]) {
                index = j
            }
        }
        if (i !== index) {
            [arr[index], arr[i]] = [arr[i], arr[index]]
        }
    }
}

const arr = [8,0,4,6,1,2,7,3,5,9]
selectionSort(arr)
console.log(arr) //  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]