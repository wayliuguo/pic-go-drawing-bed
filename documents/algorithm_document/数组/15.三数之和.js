/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    let result = []
    // 排序
    nums.sort((a,b) => a-b)
    // 遍历-确定nums[i]
    for(let i=0; i<nums.length-2; i++) {
        // 如果nums[i]大于0，则和大于0
        if(nums[i] > 0) break
        // nums[i]去重
        if(i>0 && nums[i] === nums[i-1]) continue
        let L = i+1
        let R = nums.length - 1
        // 前后指针范围
        while(L<R) {
            // 三数之和
            const sum = nums[i] + nums[L] + nums[R]
            if(sum === 0) {
                result.push([nums[i], nums[L], nums[R]])
                // 前指针去重
                while(L<R && nums[L] === nums[L+1]) L++
                // 后指针去重
                while(L<R && nums[R] === nums[R-1]) R--
                // 前指针后移、后指针前移动
                L++
                R--
            }
            else if(sum < 0) L++
            else if(sum > 0) R--
        }
    }
    return result
};

// @lc code=end

