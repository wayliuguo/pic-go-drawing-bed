/*
 * @lc app=leetcode.cn id=876 lang=javascript
 *
 * [876] 链表的中间结点
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
// 快慢指针-慢指针走一步、快指针走两步，当快指针走到末尾，则慢指针到中间
/* var middleNode = function(head) {
    let fast = head
    let slow = head
    while(fast !== null && fast.next !== null) {
        fast = fast.next.next
        slow = slow.next
    }
    return slow
}; */
// 数组解法
/* var middleNode = function(head) {
    // 数组，存入头指针
    let k = [head]
    // 当数组的最后一个不是 null， 则依次push进入数组
    while(k[k.length -1].next !== null) {
        k.push(k[k.length-1].next)
    }
    return k[Math.trunc(k.length/2)]
}; */
// 单指针解法
var middleNode = function(head) {
    let n =0
    let cur = head
    // 遍历获取链表元素个数
    while(cur != null) {
        ++n
        cur = cur.next
    }
    let k = 0
    cur = head
    // 根据链表元素个数找到中间节点
    while(k < Math.trunc(n/2)) {
        ++k
        cur = cur.next
    }
    return cur
}
// @lc code=end

