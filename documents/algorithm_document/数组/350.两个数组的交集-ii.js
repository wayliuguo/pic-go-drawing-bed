/*
 * @lc app=leetcode.cn id=350 lang=javascript
 *
 * [350] 两个数组的交集 II
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
// 排序 + 双指针
/* var intersect = function(nums1, nums2) {
   nums1.sort((a,b) => a-b)
   nums2.sort((a,b) => a-b)
   const length1 = nums1.length
   const length2 = nums2.length
   let index1=0, index2=0
   let result = []
   while(index1 < length1 && index2 < length2) {
    let num1 = nums1[index1]
    let num2 = nums2[index2]
    if(num1 === num2) {
        result.push(num1)
        index1++
        index2++
    } else if (num1 < num2) {
        index1++
    } else {
        index2++
    }
   }
   return result
}; */

// 哈希表
var intersect = function(nums1, nums2) {
    const map = new Map()
    let result = []
    // 遍历 nums1, 元素作为map的key，重复次数作为对应的value
    for(const n of nums1) {
        if(map.has(n)) {
            map.set(n, map.get(n)+1)
        } else {
            map.set(n, 1)
        }
    }
    // 遍历 nums2, 如果元素对应的值存在且value大于0，则代表相交
    for(const n of nums2) {
        if(map.has(n) && map.get(n) > 0) {
            map.set(n, map.get(n) -1)
            result.push(n)
        }
    }
    return result
};
// @lc code=end

