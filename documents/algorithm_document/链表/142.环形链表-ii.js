/*
 * @lc app=leetcode.cn id=142 lang=javascript
 *
 * [142] 环形链表 II
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
 * @return {ListNode}
 */
// 哈希表实现
/* var detectCycle = function(head) {
    let set = new Set()
    while(head !== null) {
        if(set.has(head)) {
            return head
        } else {
            set.add(head)
            head = head.next
        }
    }
    return null
}; */

// 快慢指针
var detectCycle = function(head) {
    if (head === null) {
        return null;
    }
    let slow = head, fast = head;
    // 当 fast 不为空
    while (fast !== null) {
        // 慢指针后移
        slow = slow.next;
        if (fast.next !== null) {
            // 快指针后移
            fast = fast.next.next;
        } else {
            return null;
        }
        if (fast === slow) {
            let ptr = head;
            // 找到ptr与slow相交即环节点
            while (ptr !== slow) {
                ptr = ptr.next;
                slow = slow.next;
            }
            return ptr;
        }
    }
    return null;
};
// @lc code=end

