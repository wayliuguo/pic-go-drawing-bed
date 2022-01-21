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

```

