---
title: 快速排序
categories:
 - Algorithm
tags:
 - quick sort
date: 2022-10-28
sidebar: 'auto'
---

## 前言
核心点：排序一次会将无序表**分为两个独立的部分**，其中一部分数据比另一部分数据小，循环执行直至每个部分不可再分，至此排列完成。

## 实现
1. 分区比较 => 从数组中随机选择一个基准值，比基准值小排到左边，大的排到右边。
2. 递归执行 => 递归对基准值左右两边的子数组进行分区。
```js
const arr = [3, 1 , 2, 4, 7]
console.log(quickSort(arr))
function quickSort(arr) {
  if (arr.length <= 1) return arr
  const left = []
  const right = []
  const mid = arr[0]
  for(let i = 1; i < arr.length; i++) {
    if(arr[i] < mid) {
      left.push(arr[i])
    }else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(mid, quickSort(right))
}
```
### 复杂度
* 最坏情况是每次基准值都是数组的最大or最小的元素，此时快速排序就是冒泡排序，时间复杂度O(n^2)
* 最好情况下是O(n * logn)