// 定义一个节点
class Node {
    constructor(element) {
        this.element = element
        this.next = null
    }
}
// 定义链表
class List {
    constructor() {
        // 头节点
        this.head = new Node('head')
    }
    // 查找链表元素
    find(item) {
        let currNode = this.head
        while(currNode.element !== item) {
            currNode = currNode.next
        }
        return currNode
    }
    // 追加元素
    append(item) {
        let newNode = new Node(item)
        let currNode = this.head
        while(currNode.next) {
            currNode = currNode.next
        }
        currNode.next = newNode
    }
    // 展示链表
    display() {
        let currNode = this.head
        while(currNode.next) {
            console.log('-----')
            console.log(currNode)
            console.log('-----')
            currNode =currNode.next
        }
    }
    // 在指定节点 element 后插入 item
    insert(newElement, item) {
        let newNode = new Node(newElement)
        let currNode = this.find(item)
        if(!currNode) {
            console.log('目标元素不存在')
            return false
        } 
        /**
         * 从右向左赋值
         * 使插入节点指向当前节点的下一个节点
         * 使当前节点指向插入节点
         */
        newNode.next = currNode.next 
        currNode.next = newNode
        return true
    }
    find(item) {
        let currNode = this.head
        while(currNode && currNode.element !== item) {
            currNode = currNode.next
        }
        return currNode && currNode.element === item ? currNode : false
    }
}

let myList = new List()
myList.append(1)
myList.insert(0, 'head')
myList.display()

/* -----
Node {
  element: 'head',
  next: Node { element: 0, next: Node { element: 1, next: null } } }
-----
-----
Node { element: 0, next: Node { element: 1, next: null } }
----- */
