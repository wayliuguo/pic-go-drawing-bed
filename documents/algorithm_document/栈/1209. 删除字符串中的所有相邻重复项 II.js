/*
 * @lc app=leetcode.cn id=1209 lang=javascript
 *
 * [1209] 删除字符串中的所有相邻重复项 II
 */

// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
 var removeDuplicates = function(s, k) {
    let stack = [] // 字母栈
    let countStack = [] // 数字栈
    let i = 0
    while(i<s.length) {
        // 如果和上一个是同一个
        if(stack[stack.length -1] === s[i]) {
            // 字母栈入栈
            stack.push(s[i])
            // 数字栈 +1
            countStack[countStack.length -1] += 1
            // 如果数字栈到达阈值，字母栈出栈k个，数字栈出栈
            if(countStack[countStack.length-1] === k) {
                for(let j=0; j<k; j++) {
                    stack.pop()
                }
                countStack.pop()
            }
        } else {
            stack.push(s[i])
            countStack.push(1)
        }
        i++
    }
    return stack.join('')
};

// @lc code=end

