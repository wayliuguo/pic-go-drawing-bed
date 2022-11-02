/*
 * @lc app=leetcode.cn id=160 lang=javascript
 *
 * [160] 相交链表
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
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
/* var getIntersectionNode = function(headA, headB) {
    const visited = new Set()
    let temp = headA
    while(temp !== null) {
        visited.add(temp)
        temp = temp.next
    }
    temp = headB
    while(temp !== null) {
        if(visited.has(temp)) {
            return temp
        }
        temp = temp.next
    }
    return null
}; */
var getIntersectionNode = function(headA, headB) {
    if(headA === null || headB === null) {
        return null
    }
    let pA = headA, pB = headB
    while(pA !== pB) {
        pA = pA === null ? headB : pA.next
        pB = pB === null ? headA : pB.next
    }
    return pA
};
// @lc code=end

