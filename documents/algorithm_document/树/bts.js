// 首先创建节点类
class Node {
    constructor(data, left, right) {
        // 定义节点值
        this.data = data;
        // 左孩子
        this.left = left;
        // 右孩子
        this.right = right;
    }
    // 返回节点值
    show() {
        return this.data
    }
}
// 定义二叉树类
class BST {
    constructor() {
        // 节点为空
        this.root = null;
    }
    // 添加数据方法
    insert(data) {
        // 创建一个新的节点
        let node = new Node(data, null, null);
        // 如果树的根节点为空，则作为根节点
        if (this.root === null) {
            this.root = node;
        } else {
            // 否则，作为子节点
            let current = this.root;
            let parent;
            // 循环查找子节点，查找到某个子节点为空时，将node赋值到此节点上
            while (true) {
                parent = current;
                if (data < current.data) {
                    current = current.left;
                    if (current === null) {
                        parent.left = node;
                        break;
                    }
                } else {
                    current = current.right;
                    if (current === null) {
                        parent.right = node;
                        break;
                    }
                }
            }
        }
    }
    // 前序遍历 --> 按照 根节点-左孩子-右孩子的顺序查找
    preOrder(node) {
        if (node !== null) {
            console.log(node.show());
            this.preOrder(node.left);
            this.preOrder(node.right);
        }
    }
    // 中序遍历 --> 按照 左孩子-根节点-右孩子的顺序查找
    // 中序遍历可得到一个从小到大排序好的数据集合
    inOrder(node) {
        if (node !== null) {
            this.inOrder(node.left);
            console.log(node.show());
            this.inOrder(node.right);
        }
    }
    // 中序遍历 --> 按照 左孩子-右孩子-根节点的顺序查找
    afterOrder(node) {
        if (node !== null) {
            this.afterOrder(node.left);
            this.afterOrder(node.right);
            console.log(node.show());
        }
    }
    // 获取最小值 沿着根节点一直向左孩子查找，最后一个左孩子就是最小值
    getMin() {
        let current = this.root;
        while (current.left !== null) {
            current = current.left;
        }
        return current.data;
    }
    // 获取最大值 沿着根节点一直向右孩子查找，最后一个右孩子就是最大值
    getMax() {
        let current = this.root;
        while (current.right !== null) {
            current = current.right;
        }
        return current.data;
    }
    // 查找某个值
    find(data) {
        let current = this.root;
        while (current !== null) {
            // 如果当前节点的值等于要查找的元素，返回此节点
            if (data === current.data) {
                return current;
            }
            // 如果大于节点值 就顺着右孩子继续查找
            if (data < current.data) {
                current = current.left;
            } else if (data > current.data) {
                // 否则，顺着左孩子进行查找
                current = current.right;
            }
        }
        // 查找不到，返回空
        return null;
    };
    // 删除元素
    remove(data) {
        this.root = this._removeNode(this.root, data); //将根节点转换
    }
    // 找到最小值
    _getSmallest(node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
    // 删除元素并且重新构建二叉树
    _removeNode(node, data) {
        if (node === null) {
            return null;
        }
        if (data === node.data) {
            // 如果没有子节点
            if (node.right === null && node.left === null) {
                return null;
            }
            // 如果没有左子节点
            if (node.left === null) {
                return node.right;
            }
            // 如果没有右子节点
            if (node.right === null) {
                return node.left;
            }
            // 如果有两个节点 找到最小的右节点
            let tempNode = this._getSmallest(node.right);
            node.data = tempNode.data;
            node.right = this._removeNode(node.right, tempNode.data);
            return node;
        } else if (data < node.data) {
            node.left = this._removeNode(node.left, data);
            return node;
        } else {
            node.right = this._removeNode(node.right, data);
            return node;
        }
    }
}
let bst = new BST();
let arr = [40, 20, 70, 60, 75, 71, 73]
// 循环插入数据
arr.forEach(item => bst.insert(item))
console.log(bst.root.right)
// 中序遍历二叉树
// bst.inOrder(bst.root);
// bst.remove(70);

// bst.inOrder(bst.root);

// console.log(bst.find(73))