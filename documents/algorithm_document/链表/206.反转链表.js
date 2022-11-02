/*
 * @lc app=leetcode.cn id=206 lang=javascript
 *
 * [206] 反转链表
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
// 迭代
/* var reverseList = function(head) {
    let prev = null
    let curr = head
    while(curr) {
        const next = curr.next;
        // 当前几点next 指向 prev
        curr.next = prev;
        // prev 节点后移
        prev = curr;
        // curr 节点后移
        curr = next;
    }
    return prev
}; */
var reverseList = function(head) {
    if(head === null || head.next === null) {
        return head
    }
    // 下一个节点递归
    const newHead = reverseList(head.next)
    // 当前节点的下一个节点指向当前节点
    head.next.next = head
    // 当前节点指向 null
    head.next = null
    return newHead
};
// @lc code=end

