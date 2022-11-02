/*
 * @lc app=leetcode.cn id=380 lang=javascript
 *
 * [380] O(1) 时间插入、删除和获取随机元素
 */

// @lc code=start

var RandomizedSet = function() {
    this.map = new Map()
    this.values = []
};

/** 
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.insert = function(val) {
    // 存在
    if(this.map.has(val)) {
        return false
    }
    // 不存在
    // 把val作为key，把数组的长度作为value
    this.map.set(val, this.values.length)
    this.values.push(val)
    return true
};

/** 
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.remove = function(val) {
    // 不存在
    if(!this.map.has(val)) {
        return false
    }
    // 获取val在数组对应的下标
    const index = this.map.get(val)
    // 存在且为最后一个元素
    if(index === this.values.length - 1) {
        this.values.pop()
        this.map.delete(val)
    } else {
        // 存在且不为最后一个元素，则把要删除的元素与最后一个元素调换
        const lastValue = this.values.pop()
        this.values[index] = lastValue
        this.map.set(lastValue, index)
        this.map.delete(val)
    }
    return true
};

/**
 * @return {number}
 */
RandomizedSet.prototype.getRandom = function() {
    const length = this.values.length
    const random = Math.floor(Math.random() * length)
    return this.values[random]
};

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */
// @lc code=end

