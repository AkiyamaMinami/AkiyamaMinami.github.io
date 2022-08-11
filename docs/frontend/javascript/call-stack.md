---
title: JavaScript -- 调用栈
sidebar: 'auto'
date: 2022-08-11
categories:
 - JavaScript
tags:
 - Call Stack
---

## 前言
调用栈是JavaScript引擎的**解释器**在**执行函数**的时候的一种机制。
* 是一种数据结构。
* 用于管理多个函数之间调用关系。
* 帮助我们追踪当前哪个函数在执行，执行的函数又调用的哪个函数。

## 函数调用
调用一个函数的写法 => 函数名 + ()
```js
function test() {
  console.log('芜湖~')
}
// 调用函数
test()
```
1. 执行test函数**之前**，JavaScript引擎会先创建**全局执行上下文**。
2. 执行到test()。
3. 从全局执行上下文中取出**变量环境中**的test函数代码。
4. 对test函数代码进行**编译、创建test函数执行上下文**。
5. 执行test函数的**可执行代码**。

在执行JavaScript的时候，会出现多个执行上下文，JavaScript引擎**通过栈的数据结构进行管理**。

## 栈 stack
* 单端操作数据
* 特点：先进后出
* 想象成一个桶装薯片🍟，开盖取出一片（出栈），把一片放回去（入栈）

## 调用栈（执行上下文栈）
JavaScript引擎利用栈来管理执行上下文，创建完执行上下文后，JavaScript引擎将执行上下文入栈，函数执行完毕，JavaScript引擎将该函数的执行上下文出栈，所以这种就一般称为**执行上下文栈，又名调用栈**。
![执行上下文](https://s2.loli.net/2022/08/11/yZ4E6Yzv5jpFeSc.png)

## 栈溢出（Stack Overflow）
要注意**调用栈是有大小的**，若入栈的执行上下文数量超出一定数量，JavaScript引擎会报错：超过了最大栈调用大小（Maximum call stack size exceeded）。
常见写一个递归，没有终止条件，一直创建新的执行上下文，反复入栈。~~**所以少写写递归~，你就不能用while嘛？**~~
```js
function foo(a,b){
    return foo(a,b)
}
console.log(foo(1,2))
```

## 总结

* 调用函数，JavaScript引擎创建执行上下文，将其入栈，然后开始执行可执行代码。
* 函数执行完毕，JavaScript引擎将其执行上下文出栈。
* 调用栈被塞满，报错“栈溢出”。
* 栈这种数据结构还是比较重要的。常见就是通过栈管理函数之间调用关系。