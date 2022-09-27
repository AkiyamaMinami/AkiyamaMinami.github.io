---
title: 冒泡排序
categories:
 - sort
tags:
 - bubble sort
date: 2022-09-27
sidebar: 'auto'
---

## 前言
关键点：
* 每遍历一次数组，都能排好一个数据（将一个数据冒泡浮上去）
* 一般是双重嵌套循环，时间复杂度：O(n²) => 最坏的情况，每次变量比较之后都需要交换位置
![菜鸟教程图片](https://www.runoob.com/wp-content/uploads/2019/03/bubbleSort.gif)

## 答
假设实现一个从小到大的排序。
* 比较相邻的元素，如果第一个元素比第二个元素大，交换它们。
* 每一对相邻的元素都进行比较，这样最后的元素一定是最大的元素。
* 每次完成一次上述的比较流程，后续需要排序比较的数组长度需要减少一次（每冒泡一次，都能保证一个元素排序完毕）
```js
const arr = [4,1,5,2,8,6]
// 两两比较
for (let i = 0; i < arr.length - 1; i++) {
    // 如果前一个数 > 后一个数 => 交换两数位置
    if (arr[i] > arr[i + 1]) {
        let tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
    }
}
// [1, 4, 2, 5, 6, 8]
console.log(arr)
// ============= 重复上述步骤 =============
const arr = [4,1,5,2,8,6]
function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        // 每完成一次两两比较，都有一个元素排序确定了就不需要再比较了，所以两两比较的次数逐步减i次
        for (let j = 0; j < len - 1 - i; j++) {
            // 相邻元素两两对比 
            if (arr[j] > arr[j+1]) {  
                // 元素交换      
                let temp = arr[j+1];        
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
console.log(arr)
console.log(bubbleSort(arr))
```

### 优化
加入一个标志变量exchange：标志某一次排序过程中是否存在数据交换。<br/>
**如果进行某一次排序时并未发生数据交换位置，说明此时数组已经按需排列完成了，可立即结束排序，避免不必要的比较。**
```js
const arr = [4,1,5,2,8,6]
function bubbleSort(arr){
  let i = arr.length - 1;
  while(i > 0){
    // 初始化0表示未发生交换
    let exchange = 0;
    for(let j = 0; j < i; j++){
      if(arr[j] > arr[j+1]){
        let tmp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = tmp;
        // 记录最后发生交换的位置 => exchange之后的元素均已排序完毕，下次排序只需要遍历exchange之前
        exchange = j;
      }   
    }
    // 用于下次排序作准备
    i = exchange;
   }
   return arr;
}
console.log(arr)
console.log(bubbleSort(arr))
```
## 总结
* 双循环一般复杂度O(n²)
* 遍历数组，两两进行比较交换，能保证最大的元素一定冒泡到最后。
* 记录每一次冒泡发生的最后位置，后续未发生比较交换的元素表示已经排序完毕，无需下次遍历比较。

## 参考
* [菜鸟教程-冒泡排序](https://www.runoob.com/w3cnote/bubble-sort.html)