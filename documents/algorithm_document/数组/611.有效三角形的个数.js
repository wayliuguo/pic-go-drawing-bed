/*
 * @lc app=leetcode.cn id=611 lang=javascript
 *
 * [611] 有效三角形的个数
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
/* var triangleNumber = function(nums) {
    // 数组长度
    const n = nums.length;
    // 升序排序
    nums.sort((a, b) => a - b);
    let ans = 0;
    // 第一个
    for (let i = 0; i < n; ++i) {
        // 第二个
        for (let j = i + 1; j < n; ++j) {
            // 二分法的left 和 right
            let left = j + 1, right = n - 1, k = j;
            while (left <= right) {
                // 中间下标
                const mid = Math.floor((left + right) / 2);
                // 如果中间值符合，则left向中移动，如果不符合，则right向中移动
                if (nums[mid] < nums[i] + nums[j]) {
                    k = mid;
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            ans += k - j;
        }
    }
    return ans;
}; */
var triangleNumber = function(nums) {
    const n = nums.length;
    nums.sort((a, b) => a - b);
    let ans = 0;
    for (let i = 0; i < n; ++i) {
        let k = i;
        for (let j = i + 1; j < n; ++j) {
            while (k + 1 < n && nums[k + 1] < nums[i] + nums[j]) {
                ++k;
            }
            ans += Math.max(k - j, 0);
        }
    }
    return ans;
};
// @lc code=end

