/*
 * @lc app=leetcode.cn id=112 lang=javascript
 *
 * [112] 路径总和
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
 * @param {number} targetSum
 * @return {boolean}
 */
// 递归实现
/* var hasPathSum = function(root, targetSum) {
    if (root === null) return false
    // 如果是叶子节点，则是路径的末尾了，判断是否存在目标路径
    if(root.left === null && root.right === null) return root.val === targetSum
    // 递归判断是否存在路径
    targetSum -= root.val
    return hasPathSum(root.left, targetSum) || hasPathSum(root.right, targetSum)
}; */
// 迭代实现
var hasPathSum = function(root, targetSum) {
    if (!root) return false
    let queue = []
    let res = []

    queue.push(root)
    res.push(root.val)
    while(queue.length) {
        let top = queue.pop()
        let temp = res.pop()
        if (top.left === null && top.right === null) {
            if(temp === targetSum) return true
        }
        if(top.left) {
            queue.push(top.left)
            res.push(temp+top.left.val)
        }
        if(top.right) {
            queue.push(top.right)
            res.push(temp+top.right.val)
        }
    }
    return false
};
// @lc code=end

