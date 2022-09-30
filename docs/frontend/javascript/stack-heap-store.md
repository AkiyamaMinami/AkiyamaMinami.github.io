---
title: 数据存储 -- 栈堆
categories:
 - JavaScript
tags:
 - 数据类型
 - 内存空间
date: 2022-09-30
sidebar: 'auto'
---

## 前言
```js
function foo(){
  var a = 1
  var b = a
  a = 2
  // 2
  console.log(a)
  // 1
  console.log(b)
}
foo()
```
```js
function foo(){
  var a = { name: "test"}
  var b = a
  a.name = "1" 
  // { name: '1'  }
  console.log(a)
  // { name: '1'  }
  console.log(b)
  // 为啥只是修改了a，但是b也被同时修改了呢？
}
foo()
```

## JavaScript语言类型
每种编程语言都会内置各自的数据类型，一般数据类型都会有一些不同，使用上也会有区别。<br/>
常见的语言类型：
* 静态：**声明变量之前需要先定义变量类型** => C、C++、Java
* 动态：**声明变量之前无需确认数据类型，运行时需要检查数据类型** => JavaScript
* 强类型：**不支持隐式类型转换** => Java
* 弱类型：**支持隐式类型转换** => C、C++、JavaScript
:::tip
所以JavaScript是动态、弱类型语言。
:::

## JavaScript数据类型
* 弱类型 => 无需告诉JavaScript引擎变量是什么数据类型，JavaScript引擎运行代码的时候自己推算！
* 动态 => 可以使用同一个变量保存不同类型的数据。

使用[typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)运算符来查看变量数据类型。
```js
var bar
console.log(typeof bar) // undefined
bar = 12 // number
bar = "233" // string
bar = true // boolean
bar = null // object => 初期JavaScript语言的Bug，保留至今，没修复为了兼容老的代码。
bar = { name:"233" } // object
bar = function() {} // function
```
JavaScript中的数据类型有8种：
* Undefined => 未赋值变量的默认值、变量提升默认值
* Null => 只有一个值null
* String => JavaScript字符串不可更改
* Number => ES标准：基于IEEE754标准双精度64位二进制格式值，范围-(263 - 1) ~ 263 - 1
* Boolean => true | false
* Symbol => 符号类型表示唯一且不可修改，一般用于Object的key
* BigInt => 可以任意精度表示整数，即时超出Number整数范围也能安全存储
* Object => 对象被看做一组属性的集合。key-value组成，vaule可以是任何类型（包括函数），Object中的函数又称为**方法**

前7种数据类型称为**原始类型**，最后的对象类型称为**引用类型**。之所以区分原因就是他们在**内存中存放的位置不同**。

## 内存空间

### JavaScript内存模型概览
代码内存主要用于**存储可执行代码**。
![JS内存空间.png](https://s2.loli.net/2022/09/30/koujEziCeFpS256.png)

### 栈内存
栈内存其实就是[调用栈](./call-stack.md)，用于**存储执行上下文**。
```js
function test(){
    var a = "233" // 保存在test执行上下文中的变量环境
    var b = a // 保存在test执行上下文中的变量环境
    // JavaScript引擎判断右侧值为引用类型，引擎并非直接将其存放到变量环境，而是分配到堆内存，分配后会有一个堆地址；
    // 最后将堆地址写入到c变量值
    var c = { name:"233" }
    // JavaScript中，原始类型的赋值会完整复制变量值，而引用类型的赋值是复制引用地址。
    var d = c
}
test() // test执行上下文入栈
```
![JS栈内存.png](https://s2.loli.net/2022/09/30/smIWCT8ZVXrlSPN.png)
为什么原始数据类型直接存在栈，引用类型值存在堆，引用类型还需要通过栈中的引用地址来访问？<br/>
因为JavaScript引擎需要用栈来维护程序执行期间上下文的状态，如果栈内存很大了话，所有数据都存放在栈内存中，**会影响到上下文切换的效率，从而影响到整个程序的执行效率**。当函数执行结束，当前执行上下文被回收，JavaScript引擎离开当前执行上下文，只需要将指针移动到上一个执行上下文地址即可。<br/>
通常情况下，栈内存都不会设置太大，主要存放一些原始类型的小数据。因为引用类型的数据一般占用的内存都比较大，所以这类数据会被存放到堆中，堆空间很大，能存放很多大数据，缺点是分配内存和回收内存都会占用一定的时间。

## 总结