/*
 * @lc app=leetcode.cn id=136 lang=javascript
 *
 * [136] 只出现一次的数字
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
/*  var singleNumber = function(nums) {
    let map = new Map()
    for(let i=0; i<nums.length; i++) {
        if(map.has(nums[i])) {
            map.set(nums[i], map.get(nums[i]) + 1)
        } else {
            map.set(nums[i], 1)
        }
    }
    for(let c of map.keys()) {
        if(map.get(c) === 1) {
            return c
        }
    }
    return ''
}; */
var singleNumber = function(nums) {
    nums.sort((a,b) => a-b)
    for(let i=0; i<nums.length; i++) {
        if(nums[i-1] !== nums[i] && nums[i] !== nums[i+1]) {
            return nums[i]
        }
    }
};
// @lc code=end

