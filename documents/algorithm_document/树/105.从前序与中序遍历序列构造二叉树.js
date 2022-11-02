/*
 * @lc app=leetcode.cn id=105 lang=javascript
 *
 * [105] 从前序与中序遍历序列构造二叉树
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */

 function TreeNode(val) {
    this.val = val
    this.left = this.right = null
}
var buildTree = function(preorder, inorder) {
    if(preorder.length) {
        // 在前序中取出根节点
        let head = new TreeNode(preorder.shift())
        // 在中序中获取根节点位置index，其左边为左子树，右边为右子树
        // index 可以推测出前序中的左子树为 [0, index)， 右子树为 [index, 末尾]
        // index 可以推测出中序中的左子树为 [0, index)， 右子树为 [index + 1, 末尾]
        let index = inorder.indexOf(head.val)
        head.left = buildTree(
            preorder.slice(0, index),
            inorder.slice(0, index)
        )
        head.right = buildTree(
            preorder.slice(index),
            inorder.slice(index + 1)
        )
        return head
    } else {
        return null
    }
};
// @lc code=end

