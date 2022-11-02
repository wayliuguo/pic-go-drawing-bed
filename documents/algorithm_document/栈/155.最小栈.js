/*
 * @lc app=leetcode.cn id=155 lang=javascript
 *
 * [155] 最小栈
 */

// @lc code=start

var MinStack = function() {
    this.items = []
    this.min = null
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    if (!this.items.length) this.min = val
    this.min = Math.min(val, this.min)
    this.items.push(val)
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    let num = this.items.pop()
    this.min = Math.min(...this.items)
    return num
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    if(!this.items.length) return null
    return this.items[this.items.length -1]
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.min
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
// @lc code=end

