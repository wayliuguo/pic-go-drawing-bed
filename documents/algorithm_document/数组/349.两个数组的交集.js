/*
 * @lc app=leetcode.cn id=349 lang=javascript
 *
 * [349] 两个数组的交集
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
/* var intersection = function(nums1, nums2) {
    var set_intersection = function(set1, set2) {
        // 遍历长度短的set
        if(set1.size > set2.size) {
            return set_intersection(set2, set1)
        }
        let result = []
        for(let item of set1) {
            // 相交
            if(set2.has(item)) {
                result.push(item)
            }
        }
        return result
    }
    const set1 = new Set(nums1)
    const set2 = new Set(nums2)
    return set_intersection(set1, set2)
}; */
var intersection = function(nums1, nums2) {
    nums1.sort((a,b) => a-b)
    nums2.sort((a,b) => a-b)
    let length1 = nums1.length
    let length2 = nums2.length
    // 两个数组指针
    let index1 = 0, index2 = 0
    const result = []
    while(index1 < length1 && index2 < length2) {
        let num1 = nums1[index1]
        let num2 = nums2[index2]
        // 相交
        if(num1 === num2) {
            // 去重
            if(!result.length || result[result.length-1] !== num1) {
                result.push(num1)
            }
            index1++
            index2++
        } else if(num1 < num2) {
            index1++
        } else {
            index2++
        }
    }
    return result
};
// @lc code=end

