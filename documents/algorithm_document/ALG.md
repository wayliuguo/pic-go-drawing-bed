## 1. 数组

### 1.1 两数之和

- 描述

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** *`target`* 的那 **两个** 整数，并返回它们的数组下标。

- 例子

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

- 进阶

你可以想出一个时间复杂度小于 `O(n2)` 的算法吗？

```
// 普通版
/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
 var twoSum = function(nums, target) {
    for(let i=0; i<nums.length; i++) {
        for(let j=i+1; j<nums.length; j++) {
            if(nums[j] === target - nums[i]) {
                return [i, j]
            }
        }
    }
};
// @lc code=end
```

```
// 优化版-map
/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let map = new Map()
    for(let i=0; i<nums.length; i++) {
        if(map.has(target - nums[i])) {
            return [map.get(target - nums[i]), i]
        } else {
            map.set(nums[i], i)
        }
    }
    return []
};
// @lc code=end
```

### 1.2 简化路径

给你一个字符串 `path` ，表示指向某一文件或目录的 Unix 风格 **绝对路径** （以 `'/'` 开头），请你将其转化为更加简洁的规范路径。

在 Unix 风格的文件系统中，一个点（`.`）表示当前目录本身；此外，两个点 （`..`） 表示将目录切换到上一级（指向父目录）；两者都可以是复杂相对路径的组成部分。任意多个连续的斜杠（即，`'//'`）都被视为单个斜杠 `'/'` 。 对于此问题，任何其他格式的点（例如，`'...'`）均被视为文件/目录名称。

请注意，返回的 **规范路径** 必须遵循下述格式：

- 始终以斜杠 `'/'` 开头。
- 两个目录名之间必须只有一个斜杠 `'/'` 。
- 最后一个目录名（如果存在）**不能** 以 `'/'` 结尾。
- 此外，路径仅包含从根目录到目标文件或目录的路径上的目录（即，不含 `'.'` 或 `'..'`）。

返回简化后得到的 **规范路径** 

```
/*
 * @lc app=leetcode.cn id=71 lang=javascript
 *
 * [71] 简化路径
 */

// @lc code=start
/**
 * @param {string} path
 * @return {string}
 */
 var simplifyPath = function(path) {
    let stack = []
    path = path.split('/')
    for(let i=0; i<path.length; i++) {
        if(path[i] === '.' || path[i] === '') continue
        if(path[i] === '..') stack.pop()
        else stack.push(path[i])
    }
    return '/' + stack.join('/')
};
// @lc code=end
```

**延申**

- String.prototype.spilt() ：字符串转数组
- Array.prototype.join()：数组转字符串

### 1.3 合并两个有序数组

给你两个按 **非递减顺序** 排列的整数数组 `nums1` 和 `nums2`，另有两个整数 `m` 和 `n` ，分别表示 `nums1` 和 `nums2` 中的元素数目。

请你 **合并** `nums2` 到 `nums1` 中，使合并后的数组同样按 **非递减顺序** 排列。

**注意：**最终，合并后数组不应由函数返回，而是存储在数组 `nums1` 中。为了应对这种情况，`nums1` 的初始长度为 `m + n`，其中前 `m` 个元素表示应合并的元素，后 `n` 个元素为 `0` ，应忽略。`nums2` 的长度为 `n` 。

```
输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
输出：[1,2,2,3,5,6]
解释：需要合并 [1,2,3] 和 [2,5,6] 。
合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。
```

- 题解一
  - 合并数组
  - 排序

```
var merge = function(nums1, m, nums2, n) {
    nums1.splice(m, nums1.length - m, ...nums2);
    nums1.sort((a, b) => a - b);
};
```

- 题解二
  - 创建一个空数组
  - 双指针，两两比较放入空数组

```
var merge = function(nums1, m, nums2, n) {
    let p1 =0
    let p2 = 0
    const sorted = Array.from(m+n).fill(0)
    let cur
    while(p1<m || p2 < n) {
        if(p1 === m) {
            cur = nums2[p2++]
        } else if(p2 === n) {
            cur = nums1[p1++]
        } else if(nums1[p1] < nums2[p2]) {
            cur = nums1[p1++]
        } else {
            cur = nums2[p2++]
        }
        sorted.push(cur)
    }
    for(let i=0; i<sorted.length; i++) {
        nums1[i] = sorted[i]
    }
};
```

- 题解三
  - 逆向双指针，从后向前遍历，取两者之间的大者放入nums1的后面

```
var merge = function(nums1, m, nums2, n) {
    let p1 = m - 1
    let p2 = n - 1
    let tail = m + n -1
    let cur
    while(p1 >= 0 || p2 >= 0) {
        if(p1 === -1) {
            // 如果 nums1 遍历完了,则 nums2 里剩下的都比 nums1 的小
            cur = nums2[p2--]
        } else if(p2 === -1) {
            // 如果 nums2 遍历完了,则 nums1 里剩下的都比 nums2 的小
            cur = nums1[p1--]
        } else if(nums2[p2] > nums1[p1]) {
            // 如果 nums2 的最后一个大于 num1 的最后一个
            cur = nums2[p2--]
        } else {
            cur = nums1[p1--]
        }
        nums1[tail--] =  cur
    }
}
```

### 1.4 三数之和

给你一个包含 `n` 个整数的数组 `nums`，判断 `nums` 中是否存在三个元素 *a，b，c ，*使得 *a + b + c =* 0 ？请你找出所有和为 `0` 且不重复的三元组。

**注意：**答案中不可以包含重复的三元组。

```
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
```

- 题解一
  - 3个for循环，但是有重复复元组，如[-1, 0, 1]、[0, 1, -1]
  - 解决重复
    - 先对数组进行升序，则first<=second<=third
    - 使用String(first)+String(second)+ String(third)为map的key
  - 缺点：超出时间限制

```
var threeSum = function(nums) {
    let map = new Map()
    let result = []
    // 排序
    nums.sort((a,b) => a-b)
    if(nums.length <3) return result
    for(let i=0; i<nums.length-2; i++) {
        // 第一个
        let first = nums[i]
        for(let j=i+1; j<nums.length -1; j++) {
            // 第二个
            let second = nums[j]
            for(let k=j+1; k< nums.length; k++) {
                // 第三个
                let third = nums[k]
                if(first + second + third === 0) {
                    // 取出他们的字符串拼接作为key
                    let mapKey = String(first) + String(second) + String(third)
                    // 去重操作
                    if(!map.has(mapKey)) {
                        result.push([first, second, third])
                        map.set(mapKey, true)
                    }
                }
            }
        }
    }
    return result
};
```

- 题解二:排序+双指针
  - 排序，固定一个数nums[i],左右指针nums[i]后面的两端，为nums[L]、nums[R]，计算三个数之和sum是否满足等于0
  - 如果nums[i]大于0，则全大于0
  - **如果nums[i] === nums[i-1],固定的第一个和前一个下表相等，则表示该数字重复了**
  - **当 sum === 0，nums[L] === nums[L+1],表示重复，跳过，L++**
  - **当 sum === 0，nums[R] === nums[R-1],表示重复，跳过，L++**
  - 事件复杂度：O(n²),n为数组长度

```
var threeSum = function(nums) {
    let result = []
    // 排序
    nums.sort((a,b) => a-b)
    // 遍历-确定nums[i]
    for(let i=0; i<nums.length-2; i++) {
        // 如果nums[i]大于0，则和大于0
        if(nums[i] > 0) break
        // nums[i]去重
        if(i>0 && nums[i] === nums[i-1]) continue
        let L = i+1
        let R = nums.length - 1
        // 前后指针范围
        while(L<R) {
            // 三数之和
            const sum = nums[i] + nums[L] + nums[R]
            if(sum === 0) {
                result.push([nums[i], nums[L], nums[R]])
                // 前指针去重
                while(L<R && nums[L] === nums[L+1]) L++
                // 后指针去重
                while(L<R && nums[R] === nums[R-1]) R--
                // 前指针后移、后指针前移动
                L++
                R--
            }
            else if(sum < 0) L++
            else if(sum > 0) R--
        }
    }
    return result
};
```

### 1.5 手写数组去重、扁平化函数、排序

```
// 扁平化--flat node>12
const flattenDeep = array => array.flat(Infinity)
// 去重
const unique = array => Array.from(new Set(array))
// 排序(升序)
const sort = array => array.sort((a,b) => a-b)

// 函数组合
const compose = (...fns) => (initValue) => fns.reduceRight((y, fn) => fn(y), initValue)

// 组合最后函数
const flatten_unique_sort = compose(sort, unique, flattenDeep)

let arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10]
console.log(flatten_unique_sort(arr)) //[1,  2, 3,  4,  5,  6, 7,  8, 9, 10, 11, 12, 13, 14]
```

### 1.6 两个数组的交集

给定两个数组，编写一个函数来计算它们的交集。

```
输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2]
```

- 题解一
  - 利用set去重两个数组
  - 遍历短的set

```
var intersection = function(nums1, nums2) {
    var set_intersection = function(set1, set2) {
    	// 遍历长度短的set
        if(set1.size > set2.size) {
            return set_intersection(set2, set1)
        }
        let result = []
        for(let item of set1) {
        	// 相交
            if(set2.has(item)) {
                result.push(item)
            }
        }
        return result
    }
    const set1 = new Set(nums1)
    const set2 = new Set(nums2)
    return set_intersection(set1, set2)
};
```

- 题解二
  - 排序
  - 使用两个指针指向数组的头部
  - 为了保证唯一性，需要与上一次加入答案数组的元素进行对比

```
var intersection = function(nums1, nums2) {
    nums1.sort((a,b) => a-b)
    nums2.sort((a,b) => a-b)
    let length1 = nums1.length
    let length2 = nums2.length
    // 两个数组指针
    let index1 = 0, index2 = 0
    const result = []
    while(index1 < length1 && index2 < length2) {
        let num1 = nums1[index1]
        let num2 = nums2[index2]
        // 相交
        if(num1 === num2) {
            // 去重
            if(!result.length || result[result.length-1] !== num1) {
                result.push(num1)
            }
            index1++
            index2++
        } else if(num1 < num2) {
            index1++
        } else {
            index2++
        }
    }
    return result
};
```

### 1.7 两个数组的交集 II

给你两个整数数组 `nums1` 和 `nums2` ，请你以数组形式返回两数组的交集。返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。可以不考虑输出结果的顺序。

```
输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2,2]
```

- 题解一
  - 排序两个数组
  - 双指针指向头部，找相等，元素小的指针加一
  - 如果相等，则相交，两个指针都加一

```
var intersect = function(nums1, nums2) {
   nums1.sort((a,b) => a-b)
   nums2.sort((a,b) => a-b)
   const length1 = nums1.length
   const length2 = nums2.length
   let index1=0, index2=0
   let result = []
   while(index1 < length1 && index2 < length2) {
    let num1 = nums1[index1]
    let num2 = nums2[index2]
    if(num1 === num2) {
        result.push(num1)
        index1++
        index2++
    } else if (num1 < num2) {
        index1++
    } else {
        index2++
    }
   }
   return result
};
```

- 哈希表
  - 遍历一个数组，取得元素及元素出现的次数
  - 遍历另一个数组，根据出现次数获得相交次数

```
var intersect = function(nums1, nums2) {
    const map = new Map()
    let result = []
    // 遍历 nums1, 元素作为map的key，重复次数作为对应的value
    for(const n of nums1) {
        if(map.has(n)) {
            map.set(n, map.get(n)+1)
        } else {
            map.set(n, 1)
        }
    }
    // 遍历 nums2, 如果元素对应的值存在且value大于0，则代表相交
    for(const n of nums2) {
        if(map.has(n) && map.get(n) > 0) {
            map.set(n, map.get(n) -1)
            result.push(n)
        }
    }
    return result
};
```

### 1.8 有效三角形的个数

给定一个包含非负整数的数组 `nums` ，返回其中可以组成三角形三条边的三元组个数。

```
输入: nums = [2,2,3,4]
输出: 3
解释:有效的组合是: 
2,3,4 (使用第一个 2)
2,3,4 (使用第二个 2)
2,2,3
```

- 题解一
  - 排序+二分法
  - 排序的作用：前三个a、b、c，使得a<b<c,则只需要判断a+b>c即可

```
var triangleNumber = function(nums) {
    // 数组长度
    const n = nums.length;
    // 升序排序
    nums.sort((a, b) => a - b);
    let ans = 0;
    // 第一个
    for (let i = 0; i < n; ++i) {
        // 第二个
        for (let j = i + 1; j < n; ++j) {
            // 二分法的left 和 right
            let left = j + 1, right = n - 1, k = j;
            while (left <= right) {
                // 中间下标
                const mid = Math.floor((left + right) / 2);
                // 如果中间值符合，则left向中移动，如果不符合，则right向中移动
                if (nums[mid] < nums[i] + nums[j]) {
                    k = mid;
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            ans += k - j;
        }
    }
    return ans;
};
```

- 题解二
  - 排序+双指针

```
var triangleNumber = function(nums) {
    const n = nums.length;
    nums.sort((a, b) => a - b);
    let ans = 0;
    for (let i = 0; i < n; ++i) {
        let k = i;
        for (let j = i + 1; j < n; ++j) {
            while (k + 1 < n && nums[k + 1] < nums[i] + nums[j]) {
                ++k;
            }
            ans += Math.max(k - j, 0);
        }
    }
    return ans;
};
```



## 2. APIS

### 2.1 String.prototype.split()

```
console.log('a/b/c/.././e/f'.split('/'))
// ["a", "b", "c", "..", ".", "e", "f"]
```

### 2.2 Array.prototype.join()

```
console.log(["a", "b", "c", "..", ".", "e", "f"].join('/'))
// "a/b/c/.././e/f"
```

### 2.3 Array.prototype.sort()

- sort(compareFunction)

- 默认排序规则，如果省略回调函数，元素按照转换为的字符串的各个字符的Unicode位点进行排序

```
[10, 20, 1, 2].sort(); // [1, 10, 2, 20]
```

```
[10, 20, 1, 2].sort((a,b) => a-b)
// [1, 2, 10, 20]
```

- 如果 `compareFunction(a, b)` 小于 0 ，那么 a 会被排列到 b 之前
- 如果 `compareFunction(a, b)` 等于 0 ， a 和 b 的相对位置不变
- 如果 `compareFunction(a, b)` 大于 0 ， b 会被排列到 a 之前

### 2.4 Set

#### 2.4.1 基本用法

**与数组类似，成员都是唯一的**

- 创建

  ```
  const set = new Set([1,2,3,4])
  // Set(4) {1, 2, 3, 4}
  ```

- Set.prototype.size: 返回 Set 实例的成员总数

  ```
  set.size
  // 4
  ```

- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身

  ```
  let result = set.add(5)
  result
  // Set(5) {1, 2, 3, 4, 5}
  ```

- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功

  ```
  let delRet = set.delete(5)
  delRet // true
  ```

- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。

  ```
  set.has(1) // true
  ```

- `Set.prototype.clear()`：清除所有成员，没有返回值。

  ```
  set.clear()
  set // Set(0) {}
  ```

#### 2.4.2 应用

- 去重

```
let array = [0,1,1,0,2,3,6,5,5,3]
const set = new Set(array)
result // (6) [0, 1, 2, 3, 6, 5]
```

```
const unique = array => Array.from(new Set(array))
```

#### 2.4.3 遍历

- `Set.prototype.keys()`：返回键名的遍历器
- `Set.prototype.values()`：返回键值的遍历器
- `Set.prototype.entries()`：返回键值对的遍历器
- `Set.prototype.forEach()`：使用回调函数遍历每个成员

**set 结构键值和键名都是同一个**

```
let set = new Set(['red', 'green', 'blue']);
for(let item of set.keys()) {
    console.log(item) // red green blue
}
for(let item of set.entries()) {
    console.log(item)
    // (2) ["red", "red"]
    // (2) ["green", "green"]
    // (2) ["blue", "blue"]
}

set.forEach((key,value) => console.log(key+': ' + value))
//red: red
//green: green
//blue: blue
```

### 2.5 Map

**类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作“键”**

#### 2.5.1 基本用法

- **size 属性**
- **Map.prototype.set(key, value)**
- **Map.prototype.get(key)**
- **Map.prototype.has(key)**
- **Map.prototype.delete(key)**
- **Map.prototype.clear()**

#### 2.5.2 遍历方法

- `Map.prototype.keys()`：返回键名的遍历器。
- `Map.prototype.values()`：返回键值的遍历器。
- `Map.prototype.entries()`：返回所有成员的遍历器。
- `Map.prototype.forEach()`：遍历 Map 的所有成员。

### 2.6 Array.prototype.reduce()

- 语法

  ```
  arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
  ```

  - accumulator: 累加器—上一次调用回调的累计值
  - currentValue: 当前值
  - index： 当前索引
  - array：调用 reduce的数组
  - initialValue: 初始值

- 例子

```
const array = [1,2,3,4]
array.reduce((pre, cur, index, arr) => {
    console.log(`${pre}--${cur}--${index}--${arr}`)
    return pre + cur
},10)

/* 10--1--0--1,2,3,4
11--2--1--1,2,3,4
13--3--2--1,2,3,4
16--4--3--1,2,3,4 */
```

### 2.7 递归的调用细节

```
function calc(n){
    if(n>0) {
        return calc(n-1) * n
    }
    return 1
}
calc(3)
```

**调用栈：**

- n: 3   calc(3)  return calc(2) * 3
- n: 2   calc(2) return calc(1) * 2
- n: 1   calc(1) return calc(0) * 1
- n: 0   calc(0) return 1

**执行细节**

由于调用栈是先进后出，则

- n: 0 return 1  calc(0)=1
- n: 1 return 1*1  calc(1) =calc(0) * 1 = 1*1
- n:2 return 1 * 1 * 2 calc(2)= calc(1)*2 = 1 * 1 * 2
- n:3 return 1 * 1 * 2 * 3 calc(3) = calc(2) * 3 = 1 * 1 * 2 *3

## 3. 链表

### 3.1 链表与数组的对比

- 数组
  - 优点：
    - 查找方便
  - 缺点
    - 添加和删除元素需要将数组中的其他元素向前或向后平移
- 链表
  - 优点
    - 不需要连续的空间
    - 存取方便
  - 缺点
    - 查找不方便

```
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
```

### 3.2 合并两个有序数组

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

```
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
```

- 解法一
  - 如果任何一链遍历完，返回另一剩下的
  - 对比值，递归调用对比，并把下一结果作为上一结果的next

```
var mergeTwoLists = function(list1, list2) {
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
};
```

- 迭代
  - 如果都不是空链表，比较较小值添加到结果链表，添加后对应链表后移
  - 如果有一个遍历完，剩下的添加到结果

```
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
```

### 3.3 环形链表

给你一个链表的头节点 `head` ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 `pos` 是 `-1`，则在该链表中没有环。**注意：`pos` 不作为参数进行传递**，仅仅是为了标识链表的实际情况。

如果链表中存在环，则返回 `true` 。 否则，返回 `false` 

```
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点
```

[题解]: https://leetcode-cn.com/problems/linked-list-cycle/solution/huan-xing-lian-biao-by-leetcode-solution/

- 解法一: **超出时间限制**
  - 遍历过的给一个标记: has,判断如果有遍历过程中有has，则return true
  - 否则 return false

```
var hasCycle = function(head) {
    let has = true
    while(head) {
        if(head.next && !head.has) {
            head.has = has
            head.next = head
        } else if(head.has) {
            return true
        }
    }
    return false
};
```

- 解法二
  - 哈希表实现
  - 如果未存在的则加入哈希表
  - 否则已存在则有环

```
var hasCycle = function(head) {
    let set = new Set()
    while(head !== null) {
        if(set.has(head)) {
            return true
        } else {
            set.add(head)
            head = head.next
        }
    }
    return false
}
```

- 解法三
  - 快慢指针

```
var hasCycle = function(head) {
    if(head === null || head.next === null) {
        return false
    }
    // 快慢指针
    let slow = head
    let fast = head.next
    // 如果快指针与满指针不相等
    while(slow !== fast) {
        // 边界：由于快指针走两步，所以判断当前及下一个
        if(fast === null || fast.next === null) {
            return false
        }
        // 快指针走两步，慢指针走一步
        fast = fast.next.next
        slow = slow.next
    }
    return true
}
```

### 3.4 环形链表 II

给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 `pos` 是 `-1`，则在该链表中没有环。**注意：`pos` 不作为参数进行传递**，仅仅是为了标识链表的实际情况。

```
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。
```

- 哈希表实现

```
var detectCycle = function(head) {
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
};
```

- 快慢指针

![142_fig1](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/142_fig1.png)

- 设链表中环外部分的长度为 **a**。**slow** 指针进入环后，又走了 **b** 的距离与 **fast** 相遇,则**slow走过距离=a+b**
- **fast**已经走了n圈，则**fast走过距离=a+b+n(b+c) ==> *a*+(*n*+1)*b*+nc **
- **fast** 指针走过的距离都为**slow** 指针的 2倍,即 **a*+(*n*+1)*b*+nc = 2(a+b)  ==> a=c+(n-1)(b+c)**
- 观察可得，从相遇点到入环点的距离加上 n-1*n*−1 圈的环长，恰好等于从链表头部到入环点的距离

```
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
```

### 3.5 反转链表

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

- 解法一
  - 迭代
  - 第一轮
    - prev=null, 1->prev, 节点后移，prev=1, curr=2
  - 第二轮
    - pre=1, 2->prev,节点后移，prev=2，curr=3
  - ...

```
var reverseList = function(head) {
    let prev = null
    let curr = head
    while(curr) {
        const next = curr.next;
        // 当前几点next 指向 prev
        curr.next = prev;
        // prev 节点后移
        prev = curr;
        // curr 节点后移
        curr = next;
    }
    return prev
};
```

- 解法二
  - 递归
  - 把拿到的链表进行反转，然后返回新的头结点
  - reverseList(1)
    - reverseList(2)
    - 2 -> 1 1 -> null
  - reverseList(2)
    - reverseList(3)
    - 3 -> 2 2 -> null
  - reverseList(3)
    - reverseList(4)
    - 4 -> 3 3-> null
  - reverseList(4)
    - reverseList(5)
    - 5 -> 4 4 -> null
  - reverseList(5)
    - return 5
- 按照调用栈，则会先入后出，先执行reverseList(5) -> reverseList(1),则反转

```
var reverseList = function(head) {
    if(head === null || head.next === null) {
        return head
    }
    // 下一个节点递归
    const newHead = reverseList(head.next)
    // 当前节点的下一个节点指向当前节点
    head.next.next = head
    // 当前节点指向 null
    head.next = null
    return newHead
};
```

### 3.6 链表的中间节点

给定一个头结点为 `head` 的非空单链表，返回链表的中间结点。

如果有两个中间结点，则返回第二个中间结点。

```
输入：[1,2,3,4,5]
输出：此列表中的结点 3 (序列化形式：[3,4,5])
```

```
输入：[1,2,3,4,5,6]
输出：此列表中的结点 4 (序列化形式：[4,5,6])
由于该列表有两个中间结点，值分别为 3 和 4，我们返回第二个结点。
```

- 解法一：
  - 快慢指针
  - 慢指针走一步、快指针走两步，当快指针走到末尾，则慢指针到中间

```
var middleNode = function(head) {
    let fast = head
    let slow = head
    while(fast !== null && fast.next !== null) {
        fast = fast.next.next
        slow = slow.next
    }
    return slow
}
```

- 解法二：
  - 数组：将遍历的元素依次放入数组A中，如果我们遍历到了N个元素，则链表以及数组的长度为N,对应的中间节点为A[N/2]

```
var middleNode = function(head) {
    // 数组，存入头指针
    let k = [head]
    // 当数组的最后一个不是 null， 则依次push进入数组
    while(k[k.length -1].next !== null) {
        k.push(k[k.length-1].next)
    }
    return k[Math.trunc(k.length/2)]
};
```

- 解法三
  - 单指针解法
  - 进行两次遍历，第一次获取链表元素个数，第二次根据个数找到中间节点

```
// 单指针解法
var middleNode = function(head) {
    let n =0
    let cur = head
    // 遍历获取链表元素个数
    while(cur != null) {
        ++n
        cur = cur.next
    }
    let k = 0
    cur = head
    // 根据链表元素个数找到中间节点
    while(k < Math.trunc(n/2)) {
        ++k
        cur = cur.next
    }
    return cur
}
```

### 3.7 删除链表的倒数第 n 个节点

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

- 题解一
  - 计算链表的长度

```
var removeNthFromEnd = function(head, n) {
    // 遍历获取链表长度
    let length = getLength(head)
    // 哑节点，其next指向 head
    let dummy = new ListNode(0, head)
    let cur = dummy
    for(let i=1; i< length-n+1; i++) {
        cur = cur.next
    }
    cur.next = cur.next.next
    return dummy.next
    
    function getLength(head) {
        let length = 0
        while(head !== null) {
            ++length
            head = head.next
        }
        return length
    }
};
```

- 题解二
  - 栈法
  - 全部入栈
  - 出栈第n个之前的
  - 删除第n个节点

```
var removeNthFromEnd = function(head, n) {
    const dummy = new ListNode(0, head)
    const stack = new Array()
    let pushList = dummy
    // 全部入栈
    while(pushList !== null) {
        stack.push(pushList)
        pushList = pushList.next
    }
    // 倒数第n个节点前出栈
    for(let i=0; i<n; i++) {
        stack.pop()
    }
    // 删除第n个节点
    let peek = stack[stack.length - 1]
    peek.next = peek.next.next
    return dummy.next
}
```

- 题解三
  - 双指针
  - 前指针forward，后指针backward相差为n后同时向后推进
  - 当forward到达终点时，即forward.next 为null 时，backward恰好到达倒数第n项的前一项
  - 链接倒数第n项的前后项

```
var removeNthFromEnd = function(head, n) {
    const dummy = new ListNode(0, head)
    let forward = dummy, backward = dummy
    // 前指针向前走n步
    while(n--) {
        forward = forward.next
    }
    // 前指针与后指针往后走
    while(forward.next) {
        forward = forward.next
        backward = backward.next
    }
    backward.next = backward.next.next
    return dummy.next
}
```

### 3.8 相交链表

给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null` 。

图示两个链表在节点 `c1` 开始相交**：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)

- 解法一
  - 哈希表
  - 遍历第一条链表，加入哈希表
  - 遍历第二条链表，如果相加则返回相交节点，否则返回null

```
var getIntersectionNode = function(headA, headB) {
    const visited = new Set()
    let temp = headA
    while(temp !== null) {
        visited.add(temp)
        temp = temp.next
    }
    temp = headB
    while(temp !== null) {
        if(visited.has(temp)) {
            return temp
        }
        temp = temp.next
    }
    return null
};
```

- 解法二

  - 情况一：两个链表相交

  - 链表 headA 和headB 的长度分别是 m 和 n。假设链表 headA 的不相交部分有 a 个节点，链表headB 的不相交部分有 b 个节点，两个链表相交的部分有 c 个节点，则有 a+c=m，b+c=n。

    - 如果 a=b，则两个指针会同时到达两个链表相交的节点，此时返回相交的节点；

      如果 a !==b，则指针 pA 会遍历完链表 headA，指针 pB 会遍历完链表 headB，两个指针不会同时到达链表的尾节点，然后指针 pA 移到链表 headB 的头节点，指针pB 移到链表 headA 的头节点，然后两个指针继续移动，在指针 pA 移动了 a+c+b 次、指针 pB 移动了b+c+a 次之后，两个指针会同时到达两个链表相交的节点，该节点也是两个指针第一次同时指向的节点，此时返回相交的节点。

  - 情况二：两个链表不相交

  - 链表 headA 和 headB 的长度分别是 m 和 n。考虑当 m=n 和 m !==n 时，两个指针分别会如何移动：

    - 如果m*=*n，则两个指针会同时到达两个链表的尾节点，然后同时变成空值null，此时返回 null；
- 如果 m !==n，则由于两个链表没有公共节点，两个指针也不会同时到达两个链表的尾节点，因此两个指针都会遍历完两个链表，在指针 pA 移动了 m+nm+n 次、指针pB 移动了n+m 次之后，两个指针会同时变成空值 null，此时返回 null。

```
var getIntersectionNode = function(headA, headB) {
    if(headA === null || headB === null) {
        return null
    }
    let pA = headA, pB = headB
    while(pA !== pB) {
        pA = pA === null ? headB : pA.next
        pB = pB === null ? headA : pB.next
    }
    return pA
};
```

## 4. 栈

### 4.1 最小栈

设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。

实现 `MinStack` 类:

- `MinStack()` 初始化堆栈对象。
- `void push(int val)` 将元素val推入堆栈。
- `void pop()` 删除堆栈顶部的元素。
- `int top()` 获取堆栈顶部的元素。
- `int getMin()` 获取堆栈中的最小元素

```
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]
解析
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
```

```
/*
 * @lc app=leetcode.cn id=155 lang=javascript
 *
 * [155] 最小栈
 */

// @lc code=start

var MinStack = function() {
    this.items = []
    this.min = null
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    if (!this.items.length) this.min = val
    this.min = Math.min(val, this.min)
    this.items.push(val)
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    let num = this.items.pop()
    this.min = Math.min(...this.items)
    return num
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    if(!this.items.length) return null
    return this.items[this.items.length -1]
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.min
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
// @lc code=end
```

### 4.2 有效的括号

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。

```
输入：s = "()[]{}"
输出：true
```

- 写法比较糟糕的解法

  ```
  var isValid = function(s) {
      if(s.length %2 !== 0) return false
      let arr = []
      for(let i=0; i<s.length; ++i) {
          const current = s[i]
          if(current === '(' || current === '[' || current === '{') {
              arr.push(current)
          } else {
              let pop = arr.pop()
              if(current === ')') {
                  if (pop !== '(') return false
              }
              if(current === ']') {
                  if (pop !== '[') return false
              }
              if(current === '}') {
                  if (pop !== '{') return false
              }
          }
      }
      if(!arr.length) return true
      return false
  };
  ```

- 使用 map 映射的解法

  ```
  var isValid = function(s) {
      let map = {
          '(': ')',
          '[': ']',
          '{': '}'
      }
      let stack = []
      for(let i=0; i<s.length; i++) {
          if(map[s[i]]) {
              stack.push(s[i])
          } else if(s[i] !== map[stack.pop()]) {
              return false
          }
      }
      return stack.length === 0
  };
  ```

### 4.3 删除字符串中的所有相邻重复项

给出由小写字母组成的字符串 `S`，**重复项删除操作**会选择两个相邻且相同的字母，并删除它们。

在 S 上反复执行重复项删除操作，直到无法继续删除。

在完成所有重复项删除操作后返回最终的字符串。答案保证唯一

```
输入："abbaca"
输出："ca"
解释：
例如，在 "abbaca" 中，我们可以删除 "bb" 由于两字母相邻且相同，这是此时唯一可以执行删除操作的重复项。之后我们得到字符串 "aaca"，其中又只有 "aa" 可以执行重复项删除操作，所以最后的字符串为 "ca"。
```

```
var removeDuplicates = function(s) {
    let stack = []
    for(let i=0; i<s.length; i++) {
        if(stack[stack.length-1] === s[i]) {
            stack.pop()
            continue
        }
        stack.push(s[i])
    }
    return stack.join('')
};
```

### 4.4 删除字符串中的所有相邻重复项 II

给你一个字符串 `s`，「`k` 倍重复项删除操作」将会从 `s` 中选择 `k` 个相邻且相等的字母，并删除它们，使被删去的字符串的左侧和右侧连在一起。

你需要对 `s` 重复进行无限次这样的删除操作，直到无法继续为止。

在执行完所有删除操作后，返回最终得到的字符串。

本题答案保证唯一。

```
输入：s = "deeedbbcccbdaa", k = 3
输出："aa"
解释： 
先删除 "eee" 和 "ccc"，得到 "ddbbbdaa"
再删除 "bbb"，得到 "dddaa"
最后删除 "ddd"，得到 "aa"
```

- 解法一：栈

  ```
  var removeDuplicates = function(s, k) {
      let stack = [] // 字母栈
      let countStack = [] // 数字栈
      let i = 0
      while(i<s.length) {
          // 如果和上一个是同一个
          if(stack[stack.length -1] === s[i]) {
              // 字母栈入栈
              stack.push(s[i])
              // 数字栈 +1
              countStack[countStack.length -1] += 1
              // 如果数字栈到达阈值，字母栈出栈k个，数字栈出栈
              if(countStack[countStack.length-1] === k) {
                  for(let j=0; j<k; j++) {
                      stack.pop()
                  }
                  countStack.pop()
              }
          } else {
              stack.push(s[i])
              countStack.push(1)
          }
          i++
      }
      return stack.join('')
  };
  ```

## 5. 队列

### 5.1 翻转字符串里的单词

给你一个字符串 `s` ，逐个翻转字符串中的所有 **单词** 。

**单词** 是由非空格字符组成的字符串。`s` 中使用至少一个空格将字符串中的 **单词** 分隔开。

请你返回一个翻转 `s` 中单词顺序并用单个空格相连的字符串。

**说明：**

- 输入字符串 `s` 可以在前面、后面或者单词间包含多余的空格。
- 翻转后单词间应当仅用一个空格分隔。
- 翻转后的字符串中不应包含额外的空格。

```
输入：s = "a good   example"
输出："example good a"
解释：如果两个单词间有多余的空格，将翻转后单词间的空格减少到只含一个。
```

```
输入：s = "  Bob    Loves  Alice   "
输出："Alice Loves Bob"
```

- 解法一：
  - 使用语言API

```
var reverseWords = function(s) {
    return s.trim().split(/\s+/).reverse().join(' ');
}
```

- 解法二：
  - 双端队列

```
var reverseWords = function(s) {
    let left = 0
    let right = s.length -1
    let queue = []
    let world = ''
    // 去除左右边空格
    while(s.charAt(left) === ' ') left++
    while(s.charAt(right) === ' ') right--
    while(left <= right) {
        let char = s.charAt(left)
        if (char === ' ' && world) {
            queue.unshift(world)
            world = ''
        } else if (char !== ' ') { // 排查中间有多个连续空格，所以不能只用else
            world += char
        }
        left++
    }
    queue.unshift(world) // 最后一个单词后面没有空格，需要单独入队
    return queue.join(' ')
}
```

### 5.2 无重复字符串的最长子串

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。

```
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

- 解法一：

  - 暴力解法

  ```
  var lengthOfLongestSubstring = function(s) {
      let maxLength = 0
      let currentLength = 0
      let set = new Set()
      for(let i=0; i<s.length; i++) {
          for(let j=i; j<s.length; j++) {
              if(set.has(s[j])) {
                  set.clear()
                  maxLength = maxLength > currentLength ? maxLength : currentLength
                  currentLength = 0
                  break
              } else {
                  set.add(s[j])
                  currentLength++
              }
          }
      }
      return maxLength > currentLength ? maxLength : currentLength
  };
  ```

  - 从0开始找，如果没有重复的则加入set，如果有重复的，则清空set，更新最大值，重置当前值，下标加一
  - 如果没有重复的，更新最大值，更新当前值，加入set
  - 为防止没有遍历的是没有重复的，return 的值对比处理

- 解法二

  - 滑动窗口

  ```
  var lengthOfLongestSubstring = function(s) {
      // 哈希集合，记录每个字符是否出现过
      const occ = new Set();
      const n = s.length;
      // 右指针，初始值为 -1，相当于我们在字符串的左边界的左侧，还没有开始移动
      let rk = -1, ans = 0;
      for (let i = 0; i < n; ++i) {
          if (i != 0) {
              // 左指针向右移动一格，移除一个字符
              occ.delete(s.charAt(i - 1));
          }
          while (rk + 1 < n && !occ.has(s.charAt(rk + 1))) {
              // 不断地移动右指针
              occ.add(s.charAt(rk + 1));
              ++rk;
          }
          // 第 i 到 rk 个字符是一个极长的无重复字符子串
          ans = Math.max(ans, rk - i + 1);
      }
      return ans;
  };
  ```

  - lengthOfLongestSubstring("abcabcbb")
    - i=0, rk=2, 最大为3，set：a,b,c
    - i=1, set 去除 a，rk=3, set: b,c,a
    - i=2 set 去除 b, rk=4, set: c,a,b
    - i=3, set 去除 c, rk= 5,set: a,b,c
    - i=4, set 去除a, rk=5, set: b,c 
    - i=5, set 去除b, rk=6, set:c,b
    - i=6, set 去除c, rk=6, set: b
    - i=7, set 去除b, rk=7， set: b

### 5.3 用栈实现队列

实现 `MyQueue` 类：

- `void push(int x)` 将元素 x 推到队列的末尾
- `int pop()` 从队列的开头移除并返回元素
- `int peek()` 返回队列开头的元素
- `boolean empty()` 如果队列为空，返回 `true` ；否则，返回 `false`

**说明：**

- 你 **只能** 使用标准的栈操作 —— 也就是只有 `push to top`, `peek/pop from top`, `size`, 和 `is empty` 操作是合法的。
- 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。

```
输入：
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]
输出：
[null, null, null, 1, 1, false]

解释：
MyQueue myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
myQueue.peek(); // return 1
myQueue.pop(); // return 1, queue is [2]
myQueue.empty(); // return false
```

```
var MyQueue = function() {
    this.inStack = [];
    this.outStack = [];
};

MyQueue.prototype.push = function(x) {
    this.inStack.push(x);
};

MyQueue.prototype.pop = function() {
    if (!this.outStack.length) {
        while (this.inStack.length) {
            this.outStack.push(this.inStack.pop());
        }
    }
    return this.outStack.pop();
};

MyQueue.prototype.peek = function() {
    if (!this.outStack.length) {
        while (this.inStack.length) {
            this.outStack.push(this.inStack.pop());
        }
    }
    return this.outStack[this.outStack.length - 1];
};

MyQueue.prototype.empty = function() {
    return this.outStack.length === 0 && this.inStack.length === 0;
};
```

- inStack 用于输入，outStack用于输出
- 如果输出的为空了，就把输入的全部出栈进入输出的栈

## 6. 散列表

一种以空间换取时间的方式。

1.  1.1 两数之和
2.  1.4 三数之和
3.  1.7 两个数的交集 Ⅱ

### 6.1 380.o-1-时间插入、删除和获取随机元素

实现`RandomizedSet` 类：

- `RandomizedSet()` 初始化 `RandomizedSet` 对象
- `bool insert(int val)` 当元素 `val` 不存在时，向集合中插入该项，并返回 `true` ；否则，返回 `false` 。
- `bool remove(int val)` 当元素 `val` 存在时，从集合中移除该项，并返回 `true` ；否则，返回 `false` 。
- `int getRandom()` 随机返回现有集合中的一项（测试用例保证调用此方法时集合中至少存在一个元素）。每个元素应该有 **相同的概率** 被返回。

你必须实现类的所有函数，并满足每个函数的 **平均** 时间复杂度为 `O(1)`

```
输入
["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]
[[], [1], [2], [2], [], [1], [2], []]
输出
[null, true, false, true, 2, true, false, 2]

解释
RandomizedSet randomizedSet = new RandomizedSet();
randomizedSet.insert(1); // 向集合中插入 1 。返回 true 表示 1 被成功地插入。
randomizedSet.remove(2); // 返回 false ，表示集合中不存在 2 。
randomizedSet.insert(2); // 向集合中插入 2 。返回 true 。集合现在包含 [1,2] 。
randomizedSet.getRandom(); // getRandom 应随机返回 1 或 2 。
randomizedSet.remove(1); // 从集合中移除 1 ，返回 true 。集合现在包含 [2] 。
randomizedSet.insert(2); // 2 已在集合中，所以返回 false 。
randomizedSet.getRandom(); // 由于 2 是集合中唯一的数字，getRandom 总是返回 2 。
```

- 解法一：

  - 使用set

  ```
  var RandomizedSet = function() {
      this.set = new Set()
  };
  
  /** 
   * @param {number} val
   * @return {boolean}
   */
  RandomizedSet.prototype.insert = function(val) {
      if(this.set.has(val)) {
          return false
      } else {
          this.set.add(val)
          return true
      }
  };
  
  /** 
   * @param {number} val
   * @return {boolean}
   */
  RandomizedSet.prototype.remove = function(val) {
      if(this.set.has(val)) {
          this.set.delete(val)
          return true
      } else {
          return false
      }
  };
  
  /**
   * @return {number}
   */
  RandomizedSet.prototype.getRandom = function() {
      const random = parseInt(Math.random() * this.set.size)
      return [...this.set][random]
  };
  ```

  **难点在于怎样随机返回一项，由于set没有下标，所以转为数组配合Math.random()获取随机下标**

- 哈希表 + 动态数组

  ```
  var RandomizedSet = function() {
      this.map = new Map()
      this.values = []
  };
  
  RandomizedSet.prototype.insert = function(val) {
      // 存在
      if(this.map.has(val)) {
          return false
      }
      // 不存在
      // 把val作为key，把数组的长度作为value
      this.map.set(val, this.values.length)
      this.values.push(val)
      return true
  };
  
  RandomizedSet.prototype.remove = function(val) {
      // 不存在
      if(!this.map.has(val)) {
          return false
      }
      // 获取val在数组对应的下标
      const index = this.map.get(val)
      // 存在且为最后一个元素
      if(index === this.values.length - 1) {
          this.values.pop()
          this.map.delete(val)
      } else {
          // 存在且不为最后一个元素，则把要删除的元素与最后一个元素调换
          const lastValue = this.values.pop()
          this.values[index] = lastValue
          this.map.set(lastValue, index)
          this.map.delete(val)
      }
      return true
  };
  
  RandomizedSet.prototype.getRandom = function() {
      const length = this.values.length
      const random = Math.floor(Math.random() * length)
      return this.values[random]
  };
  ```

  哈希表可以提供常数时间的插入和删除，但是实现 getRandom 时会出现问题。解决的方法是用一个列表存储值。

  insert：

  ![142_fig1](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_11-52-27.png)

delete

![142_fig1](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_11-52-43.png)

### 6.2 136.只出现一次的数字

给定一个**非空**整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

```
输入: [2,2,1]
输出: 1
```

- 哈希表

  ```
  var singleNumber = function(nums) {
      let map = new Map()
      for(let i=0; i<nums.length; i++) {
          if(map.has(nums[i])) {
              map.set(nums[i], map.get(nums[i]) + 1)
          } else {
              map.set(nums[i], 1)
          }
      }
      for(let c of map.keys()) {
          if(map.get(c) === 1) {
              return c
          }
      }
      return ''
  }
  ```

- 遍历（不使用额外空间）

  ```
  var singleNumber = function(nums) {
      nums.sort((a,b) => a-b)
      for(let i=0; i<nums.length; i++) {
          if(nums[i-1] !== nums[i] && nums[i] !== nums[i+1]) {
              return nums[i]
          }
      }
  };
  ```

## 7. 树

### 7.1 树的定义

树是一种非线性结构，它遵循：

- 仅有唯一一个根节点，没有节点则为空树
- 除根节点外，每个节点都有并仅有唯一一个父节点
- 节点间不能形成闭环

![](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/微信图片_20220224154215.png)

树有几个概念：

- 拥有相同父节点的节点，互称为兄弟节点
- **节点的深度：从根节点到该节点所经历的边的个数**
- **节点的高度：节点到叶节点的最长路径**
- 书的高度：根节点的高度

![](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_15-42-56.png)

- B、C、D 互称为兄弟节点
- 节点B 的高度为 2
- 节点B 的深度为 1
- 树的高度为 3

### 7.2 二叉树

最多仅有两个子节点的树

![](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_16-11-14.png)

### 7.3 平衡二叉树

⼆叉树中，每⼀个节点的左右⼦树的⾼度相差不能⼤于 1，称为平衡⼆叉树。

![](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_16-11-36.png)

另外还有满⼆叉树、完全⼆叉树等：

-  满⼆叉树：除了叶结点外每⼀个结点都有左右⼦叶且叶⼦结点都处在最底层的⼆叉树 
- 完全⼆叉树：深度为h，除第 h 层外，其它各层 (1～h-1) 的结点数都达到最⼤个数，第h 层所有 的结点都连续集中在最左边

### 7.4 在代码中表示一个二叉树

每个节点：

```
function Node(val) {
 	// 保存当前节点 key 值
 	this.val = val
 	// 指向左⼦节点
 	this.left = null
 	// 指向右⼦节点
 	this.right = null
}
```

⼀棵⼆叉树可以由根节点通过左右指针连接起来形成⼀个树。

```
function BinaryTree() {
	let Node = function (val) {
        this.val = val
        this.left = null
        this.right = null
 	}
 	let root = null
}
```

### 7.5 二叉树的遍历

#### 7.5.1 前序遍历

![](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_16-50-33.png)

#### 7.5.2 中序遍历

![](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_16-50-46.png)

#### 7.5.3 后序遍历

![](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_16-50-58.png)

#### 7.5.4 递归实现（前序为例）

```
// 前序遍历
const preorderTraversal = (root) => {
	let result = []
	var preOrderTraverseNode = (node) => {
        if(node) {
            // 先根节点
            result.push(node.val)
            // 然后遍历左⼦树
            preOrderTraverseNode(node.left)
            // 再遍历右⼦树
            preOrderTraverseNode(node.right)
        }
    }
    preOrderTraverseNode(root)
    return result
};
```

#### 7.5.5 迭代实现

- ⾸先根⼊栈 
- 将根节点出栈，将根节点值放⼊结果数组中
-  然后遍历左⼦树、右⼦树，因为栈是先⼊后出，所以，我们先右⼦树⼊栈，然后左⼦树⼊栈 
- 继续出栈（左⼦树被出栈）…….

```
// 前序遍历
const preorderTraversal = (root) => {
	const list = [];
    const stack = [];
 
 	// 当根节点不为空的时候，将根节点⼊栈
 	if(root) stack.push(root)
 	while(stack.length > 0) {
 		const curNode = stack.pop()
 		// 第⼀步的时候，先访问的是根节点
 		list.push(curNode.val)
 
 		// 我们先打印左⼦树，然后右⼦树
 		// 所以先加⼊栈的是右⼦树，然后左⼦树
 		if(curNode.right !== null) {
 			stack.push(curNode.right)
 		}
 		if(curNode.left !== null) {
 			stack.push(curNode.left)
 		}
 	}
 	return list
 }
```

### 7.6 二叉查找树（BST树）

⼆叉查找树与⼆叉树不同的是，它在⼆叉树的基础上，增加了对⼆叉树上节点存储位置的限 制：⼆叉搜索树上的每个节点都需要满⾜

- 左子节点值小于该节点值
- 右⼦节点值⼤于等于该节点值

![](https://gitee.com/wayliuhaha/pic-go-drawing-bed/raw/master/img/Snipaste_2022-02-24_17-48-15.png)

