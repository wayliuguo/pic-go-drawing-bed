/*
 * @lc app=leetcode.cn id=151 lang=javascript
 *
 * [151] 翻转字符串里的单词
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */

/* var reverseWords = function(s) {
    return s.trim().split(/\s+/).reverse().join(' ');
} */
var reverseWords = function(s) {
    let left = 0
    let right = s.length -1
    let queue = []
    let world = ''
    // 去除左右边空格
    while(s.charAt(left) === ' ') left++
    while(s.charAt(right) === ' ') right--
    while(left <= right) {
        let char = s.charAt(left)
        if (char === ' ' && world) {
            queue.unshift(world)
            world = ''
        } else if (char !== ' ') { // 排查中间有多个连续空格，所以不能只用else
            world += char
        }
        left++
    }
    queue.unshift(world) // 最后一个单词后面没有空格，需要单独入队
    return queue.join(' ')
}

// @lc code=end

