/*
 * @lc app=leetcode.cn id=110 lang=javascript
 *
 * [110] 平衡二叉树
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
 * @return {boolean}
 */

// 自顶向下暴力法 
const depth = node => {
    if (!node) return -1
    return 1 + Math.max(depth(node.left), depth(node.right))
}
var isBalanced = function(root) {
    if (!root) return true
    return Math.max(depth(root.left), depth(root.right)) <= 1 && isBalanced(root.left) && isBalanced(root.right)
};
// @lc code=end

