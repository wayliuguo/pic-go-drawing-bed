/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
/* var isValid = function(s) {
    if(s.length %2 !== 0) return false
    let arr = []
    for(let i=0; i<s.length; ++i) {
        const current = s[i]
        if(current === '(' || current === '[' || current === '{') {
            arr.push(current)
        } else {
            let pop = arr.pop()
            if(current === ')') {
                if (pop !== '(') return false
            }
            if(current === ']') {
                if (pop !== '[') return false
            }
            if(current === '}') {
                if (pop !== '{') return false
            }
        }
    }
    if(!arr.length) return true
    return false
}; */
var isValid = function(s) {
    let map = {
        '(': ')',
        '[': ']',
        '{': '}'
    }
    let stack = []
    for(let i=0; i<s.length; i++) {
        if(map[s[i]]) {
            stack.push(s[i])
        } else if(s[i] !== map[stack.pop()]) {
            return false
        }
    }
    return stack.length === 0
};
// @lc code=end

