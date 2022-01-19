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

**延申——map**

1. 它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
2. 属性和操作方法
   - **size 属性**
   - **Map.prototype.set(key, value)**
   - **Map.prototype.get(key)**
   - **Map.prototype.has(key)**
   - **Map.prototype.delete(key)**
   - **Map.prototype.clear()**

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

