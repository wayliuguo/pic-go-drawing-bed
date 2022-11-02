/*
 * @lc app=leetcode.cn id=141 lang=javascript
 *
 * [141] 环形链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
// 遍历（超出时间限制）
/* var hasCycle = function(head) {
    let has = true
    while(head) {
        if(head.next && !head.has) {
            head.has = has
            head.next = head
        } else if(head.has) {
            return true
        }
    }
    return false
}; */

// 哈希表实现
/* var hasCycle = function(head) {
    let set = new Set()
    while(head !== null) {
        if(set.has(head)) {
            return true
        } else {
            set.add(head)
            head = head.next
        }
    }
    return false
} */
// 快慢指针
var hasCycle = function(head) {
    if(head === null || head.next === null) {
        return false
    }
    // 快慢指针
    let slow = head
    let fast = head.next
    // 如果快指针与满指针不相等
    while(slow !== fast) {
        // 边界：由于快指针走两步，所以判断当前及下一个
        if(fast === null || fast.next === null) {
            return false
        }
        // 快指针走两步，慢指针走一步
        fast = fast.next.next
        slow = slow.next
    }
    return true
}
// @lc code=end

