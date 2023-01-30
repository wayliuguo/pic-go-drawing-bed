class MinHeap {
    constructor() {
        this.heap = [];
    }
    // 获取父节点
    getParentIndex(i) {
        return (i - 1) >> 1;
    }
    // 获取左节点
    getLeftIndex(i) {
        return i * 2 + 1;
    }
    // 获取右节点
    getRightIndex(i) {
        return i * 2 + 2;
    }
    // 交换值
    swap(i1, i2) {
        const temp = this.heap[i1];
        this.heap[i1] = this.heap[i2];
        this.heap[i2] = temp;
    }
    // 上移节点
    shiftUp(index) {
        //到达堆顶就不用上移了
        if (index == 0) { return; }
        const parentIndex = this.getParentIndex(index);
        // 最小堆要求父节点是最小的
        if (this.heap[parentIndex] > this.heap[index]) {
            this.swap(parentIndex, index);
            // 交换过后尝试继续上移
            this.shiftUp(parentIndex);
        }
    }
    //下移节点
    shiftDown(index) {
        const leftIndex = this.getLeftIndex(index);
        const rightIndex = this.getRightIndex(index);
        if (this.heap[leftIndex] < this.heap[index]) {
            this.swap(leftIndex, index);
            this.shiftDown(leftIndex);
        }
        if (this.heap[rightIndex] < this.heap[index]) {
            this.swap(rightIndex, index);
            this.shiftDown(rightIndex);
        }
    }
    //插入节点
    insert(value) {
        this.heap.push(value);
        this.shiftUp(this.heap.length - 1);
    }
    //删除节点
    pop() {
        // 把堆顶元素替换为堆的最后一个元素
        this.heap[0] = this.heap.pop();
        this.shiftDown(0);
    }
    // 获取堆顶 
    peek() {
        return this.heap[0];
    }
    // 获取堆的大小
    size() {
        return this.heap.length;
    }
}


const nums = [3,2,3,1,2,4,5,5,6]
var findKthLargest = function(nums, k) {
    const h = new MinHeap();
    nums.forEach(n => { 
        h.insert(n);
        if(h.size() > k) {
            h.pop();
        }
    });
    return h.peek();
};
console.log(findKthLargest(nums, 4))

