/*
 * @lc app=leetcode.cn id=102 lang=javascript
 *
 * [102] 二叉树的层序遍历
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
 * @return {number[][]}
 */

// 广度优先遍历 
/* var levelOrder = function(root) {
    // 如果节点为空
    if (!root) return []
    let res = [], queue = [root]
    // 遍历当前层次
    while (queue.length) {
        // 使用curr接收当前层次，temp接收下一层次
        let curr = [], temp = []
        while(queue.length) {
            const node = queue.shift()
            curr.push(node.val)
            if(node.left) {
                temp.push(node.left)
            }
            if(node.right) {
                temp.push(node.right)
            }
        }
        res.push(curr)
        queue = temp
    }
    return res
}; */

// 深度优先遍历
var levelOrder = function(root) {
    const res = []
    const dep = (node, depth) => {
        if (!node) return
        res[depth] = res[depth] || []
        res[depth].push(node.val)
        if (node.left) dep(node.left, depth+1)
        if(node.right) dep(node.right, depth+1)
    }
    dep(root, 0)
    return res
}

// @lc code=end

