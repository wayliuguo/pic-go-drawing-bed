/*
 * @lc app=leetcode.cn id=88 lang=javascript
 *
 * [88] 合并两个有序数组
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
/* var merge = function(nums1, m, nums2, n) {
    nums1.splice(m, nums1.length - m, ...nums2);
    nums1.sort((a, b) => a - b);
}; */

/* var merge = function(nums1, m, nums2, n) {
    let p1 =0
    let p2 = 0
    const sorted = Array.from(m+n).fill(0)
    let cur
    while(p1<m || p2 < n) {
        if(p1 === m) {
            cur = nums2[p2++]
        } else if(p2 === n) {
            cur = nums1[p1++]
        } else if(nums1[p1] < nums2[p2]) {
            cur = nums1[p1++]
        } else {
            cur = nums2[p2++]
        }
        sorted.push(cur)
    }
    for(let i=0; i<sorted.length; i++) {
        nums1[i] = sorted[i]
    }
}; */
var merge = function(nums1, m, nums2, n) {
    let p1 = m - 1
    let p2 = n - 1
    let tail = m + n -1
    let cur
    while(p1 >= 0 || p2 >= 0) {
        if(p1 === -1) {
            // 如果 nums1 遍历完了,则 nums2 里剩下的都比 nums1 的小
            cur = nums2[p2--]
        } else if(p2 === -1) {
            // 如果 nums2 遍历完了,则 nums1 里剩下的都比 nums2 的小
            cur = nums1[p1--]
        } else if(nums2[p2] > nums1[p1]) {
            // 如果 nums2 的最后一个大于 num1 的最后一个
            cur = nums2[p2--]
        } else {
            cur = nums1[p1--]
        }
        nums1[tail--] =  cur
    }
}
// @lc code=end

