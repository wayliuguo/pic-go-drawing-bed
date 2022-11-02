/*
 * @lc app=leetcode.cn id=19 lang=javascript
 *
 * [19] 删除链表的倒数第 N 个结点
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
 * @param {number} n
 * @return {ListNode}
 */
/* var removeNthFromEnd = function(head, n) {
    // 遍历获取链表长度
    let length = getLength(head)
    // 哑节点，其next指向 head
    let dummy = new ListNode(0, head)
    let cur = dummy
    for(let i=1; i< length-n+1; i++) {
        cur = cur.next
    }
    cur.next = cur.next.next
    return dummy.next
    
    function getLength(head) {
        let length = 0
        while(head !== null) {
            ++length
            head = head.next
        }
        return length
    }
}; */
// 栈法
/* var removeNthFromEnd = function(head, n) {
    const dummy = new ListNode(0, head)
    const stack = new Array()
    let pushList = dummy
    // 全部入栈
    while(pushList !== null) {
        stack.push(pushList)
        pushList = pushList.next
    }
    // 倒数第n个节点前出栈
    for(let i=0; i<n; i++) {
        stack.pop()
    }
    // 删除第n个节点
    let peek = stack[stack.length - 1]
    peek.next = peek.next.next
    return dummy.next
} */
var removeNthFromEnd = function(head, n) {
    const dummy = new ListNode(0, head)
    let forward = dummy, backward = dummy
    // 前指针向前走n步
    while(n--) {
        forward = forward.next
    }
    // 前指针与后指针往后走
    while(forward.next) {
        forward = forward.next
        backward = backward.next
    }
    backward.next = backward.next.next
    return dummy.next
}
// @lc code=end

