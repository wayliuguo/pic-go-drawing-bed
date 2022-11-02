/*
 * @lc app=leetcode.cn id=94 lang=javascript
 *
 * [94] 二叉树的中序遍历
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    let result = []
    let inorderTraversalNode = (node) => {
        if(node) {
            // 先遍历左⼦树
            inorderTraversalNode(node.left)
            // 再根节点
            result.push(node.val)
            // 最后遍历右⼦树
            inorderTraversalNode(node.right)
        }
    }
    inorderTraversalNode(root)
    return result
};
/* var inorderTraversal = function(root) {
    let list = []
    let stack = []
    while(root || stack.length) {
        while(root) {
            stack.push(root)
            root = root.left
        }
        root = stack.pop()
        list.push(root.val)
        root = root.right
    }
    return list
}; */
// @lc code=end

