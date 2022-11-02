// 解法一： 全局排序，取第k个数
/* let findKthLargest = (nums, k) => {
    nums.sort((a, b) => b-a).slice(0, k)
    return nums[k-1]
}
console.log(findKthLargest([4,5,1,6,2,7,3,8], 4)) // 5 */

// 解法二：局部排序，冒泡
/* let findKthLargest = (nums, k) => {
    bubbleSort(nums, k)
    return nums[nums.length - k]

}
let bubbleSort = (arr, k) => {
    for (let i=0; i<k; i++) {
        for (let j=0; j<arr.length-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
            }
        }
    }
}
console.log(findKthLargest([4,5,1,6,2,7,3,8], 4)) // 5 */

// 解法三： 堆排序
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
// 整个流程就是上浮下沉
const findKthLargest = function (nums, k) {
    // 堆元素个数，用于边界溢出校验（堆顶元素与末尾元素交换后不参与堆构建）
    let heapSize = nums.length
    buildMaxHeap(nums, heapSize) // 构建好了一个大顶堆
    // 进行下沉 大顶堆是最大元素下沉到末尾
    for (let i = nums.length - 1; i >= nums.length - k + 1; i--) {
        swap(nums, 0, i)
        --heapSize // 下沉后的元素不参与到大顶堆的调整
        // 重新调整大顶堆，由于改变了堆顶元素，所以从第0个开始调整
        maxHeapify(nums, 0, heapSize);
    }
    return nums[0]
    // 自下而上构建一颗大顶堆
    function buildMaxHeap(nums, heapSize) {
        // Math.floor(heapSize / 2) - 1： 第一个非叶子节点
        for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
            maxHeapify(nums, i, heapSize)
        }
    }
    // 从左向右，自上而下的调整节点
    function maxHeapify(nums, i, heapSize) {
        let l = i * 2 + 1
        let r = i * 2 + 2
        let largest = i
        // 比较l,r,large 三个节点，取最大
        if (l < heapSize && nums[l] > nums[largest]) {
            largest = l
        }
        if (r < heapSize && nums[r] > nums[largest]) {
            largest = r
        }
        if (largest !== i) {
            swap(nums, i, largest) // 进行节点调整
            // 继续调整下面的非叶子节点
            maxHeapify(nums, largest, heapSize)
        }
    }
    function swap(a, i, j) {
        let temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
};
// console.log(findKthLargest([4,5,1,6,2,7,3,8], 4)) // 5 */
console.log(findKthLargest([4,6,8,5,9], 3))
