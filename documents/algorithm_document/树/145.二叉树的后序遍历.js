/*
 * @lc app=leetcode.cn id=145 lang=javascript
 *
 * [145] 二叉树的后序遍历
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
/* var postorderTraversal = function(root) {
    let result = []
    let postorderTraversalNode = (root) => {
        if(root) {
            postorderTraversalNode(root.left)
            postorderTraversalNode(root.right)
            result.push(root.val)
        }
    }
    postorderTraversalNode(root)
    return result
}; */
var postorderTraversal = function(root) {
    let list = []
    let stack = []
    if (root) stack.push(root)
    while (stack.length > 0) {
        const node = stack.pop()
        list.unshift(node.val)
        if (node.left !== null) {
            stack.push(node.left)
        }
        if (node.right !== null) {
            stack.push(node.right)
        }
    }
    return list
};
// @lc code=end

