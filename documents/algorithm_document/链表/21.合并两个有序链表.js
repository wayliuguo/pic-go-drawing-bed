/*
 * @lc app=leetcode.cn id=21 lang=javascript
 *
 * [21] 合并两个有序链表
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
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
// 递归解法
/* var mergeTwoLists = function(list1, list2) {
    // 如果list1遍历完，返回list2剩下的
    if(list1 === null) {
        return list2
    }
    // 如果list2遍历完，返回list1剩下的
    if(list2 === null) {
        return list1
    }
    if(list1.val <= list2.val) {
        // 将下一结果作为上个的next
        list1.next = mergeTwoLists(list1.next, list2)
        return list1
    }
    if(list1.val >= list2.val) {
        // 将下一结果作为上个的next
        list2.next = mergeTwoLists(list2.next, list1)
        return list2
    }
}; */
var mergeTwoLists = function(list1, list2) {
    const prehead = new ListNode(-1);
    let prev = prehead;

    while(list1 !== null && list2 !== null) {
        if(list1.val <= list2.val) {
            // prev 添加节点的 next
            prev.next = list1
            // 下一个节点
            list1 = list1.next
        } else {
            prev.next = list2
            list2 = list2.next
        }
        // prev 添加节点
        prev = prev.next
    }
    prev.next = list1 === null ? list2 : list1
    return prehead.next
};
// @lc code=end

