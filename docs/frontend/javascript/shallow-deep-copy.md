---
title: 深拷贝、浅拷贝
categories:
 - JavaScript
tags:
 - Shallow Copy
 - Deep Clone
date: 2022-09-18
sidebar: 'auto'
---

## 前言
关于深浅拷贝，主要关注对**引用类型数据**的拷贝。

### 两大数据类型
* 基本类型 => 保存在栈<br/>
  Number、String、Boolean、Undefined、Null、Symbol、BigInt
* 引用（对象）类型 => **保存在堆、栈中保存了对象的引用地址**<br/>
  Object

## 浅拷贝
* 对于基本类型数据，直接拷贝数据值，二者互不影响。
* 对于引用类型，拷贝**栈内存中的引用地址**，二者互相影响。
### 方法
* 手写 -- 只拷贝对象or数组的第一层内容，深层次的引用类型共享内存地址<br/>
  [hasOwnProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)
```js
function shallowCopy(obj) {
    const newObj = {};
    // 遍历对象属性
    for(let prop in obj) {
        // 校验obj自身属性，忽略继承属性
        if(obj.hasOwnProperty(prop)){
            newObj[prop] = obj[prop];
        }
    }
    return newObj;
}
```
* Object.assign<br/>
[assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
```js
let obj = {
    age: 18,
    nature: ['1', '2'],
    obj1: {
        name: '1',
    },
}
let newObj = Object.assign({}, obj);
```
* Array.prototype.slice([begin, end))<br/>
[slice](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)<br/>
return一个新的数组，是一个由begin和end决定的原数组的浅拷贝。不改变原数组。
```js
const arr = ["1", "2", "3"]
const nArr = arr.slice(0)
nArr[0] = "233";
console.log(arr)  // ["1", "2", "3"]
console.log(nArr) // ["233", "2", "3"]
```
* Array.prototype.concat()<br/>
[concat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
)<br/>
return一个新的数组，合并两个或多个数组。不改变原数组。
```js
const arr = ["1", "2", "3"]
const nArr = arr.concat()
nArr[0] = "233";
console.log(arr) // ["1", "2", "3"]
console.log(nArr) // ["233", "2", "3"]
```
* 展开语法(Spread Syntax)<br/>
[...](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
```js
const arr = ["1", "2", "3"]
const nArr = [...arr]
nArr[0] = "233";
console.log(arr) // ["1", "2", "3"]
console.log(nArr) // ["233", "2", "3"]
```

## 深拷贝
* 对于基本类型数据，直接拷贝数据值，二者互不影响。
* 对于引用类型，创建新对象（引用）数据，开辟新栈保存新对象地址，拷贝原对象数据给新对象，二者互不影响。

## 方法
* 手写 -- 拷贝对象或数组的每一层的内容
```js
// 循环递归
// WeakMap => 弱引用意味着在没有其他引用存在时垃圾回收能正确进行
function deepClone(obj, hash = new WeakMap()) {
  // null、undefined、一般值、函数不进行拷贝操作
  if (obj == null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  // 对象进行深拷贝
  // 避免循环引用，判断该对象是否已经拷贝出现过
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = {}
  // 记录拷贝对象值
  hash.set(obj, cloneObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现递归拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```
* JSON.stringify()<br/>
注意：这种方式存在弊端，**会忽略undefined、symbol、函数**。
```js
const nObj = JSON.parse(JSON.stringify(obj));
```
[stringify](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)<br/>
JavaScript对象或值 => 转换为JSON字符串<br/>
[parse](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)<br/>
解析JSON字符串 => 构造由字符串描述的JavaScript值或对象<br/>
* lodash库 -- cloneDeep()
* JQuery -- extend()

## 总结
对于引用类型：
* 浅拷贝是拷贝一层，属性是对象时，拷贝的是栈内存中的引用地址，二者互相影响（你改我也改）。
* 深拷贝是循环递归拷贝所有层，属性为对象时，深拷贝是创建新的空对象，开新栈存引用地址，然后拷贝给新对象，二者互不影响（你改我不改）。


