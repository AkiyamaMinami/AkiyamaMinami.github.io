---
title: 闭包
sidebar: 'auto'
date: 2022-07-25
categories:
 - JavaScript
tags:
 - Closure
---

## 前言
闭包其实是词法作用域的体现。

## 作用域（Scope）
作用域是**变量和函数作用范围**，在这个区域内可以进行访问和调用。

### 两种类型
- 全局作用域
- 局部作用域
  * 函数作用域
  * 块级作用域（es6 => let、const）

### 作用域链
每个执行上下文的变量环境中，都包含一个外部引用（outer），用于指向外部的执行上下文。
当一段代码使用一个变量，JavaScript引擎首先在当前执行上下文寻找，若未寻找到，会继续在
outer所指向的执行上下文去寻找，这种查找的链条称之为作用域链。

### 词法作用域
**作用域是根据代码中声明的位置来决定的，就是静态的作用域**。
我们根据读代码就能预测出代码执行过程中如何查找变量。
JavaScript在执行的过程中，**作用域链是基于词法作用域决定的，词法作用域是写代码的阶段就决定好的**，跟函数如何调用没有关系。

### 块级作用域
- 函数执行上下文包含这两种环境 => 变量环境 + 词法环境
- var声明的变量，编译阶段存放到变量环境中
- let、const声明的变量，编译阶段存放到词法环境中<br/>
词法环境内部维护一个小型栈，栈底部是函数的最外层的变量，每当进入一个块级作用域，会把该作用域内部的变量压入栈顶；当该块级作用域执行完毕，该块级作用域从栈顶弹出。
具体查找的方式 => 从词法环境栈顶向下查询，如果在词法环境某个块查到了，直接返回给JavaScript引擎，如果没有查到，继续到变量环境进行查找。

## 闭包
加上闭包构成一个完整的作用域链。<br/>
JavaScript引擎查找顺序：
1. 当前执行上下文
2. 闭包
3. 全局执行上下文

### 产生闭包的核心
* 预扫描内部函数。
* 把内部函数引用的外部变量保存到堆中。（保存了词法作用域中变量的集合，方便后续引用）
[闭包内存模型](./stack-heap-store.html#闭包的内存模型)

### 使用场景
* 创建私有变量
* 延迟变量生命周期<br/>
  **一般函数执行上下文的词法环境在函数返回后就会销毁，但是闭包会保存着创建时所在词法环境的引用**，即时创建时候所在的执行上下文被销毁，但是闭包里面依然保存，达到延长变量生命周期的目的。

**一些例子**🌰<br/>
1. 调整页面字号的按钮
```js
function changePageFontSize(size) {
  return function() {
    document.body.style.fontSize = size + 'px';
  };
}

var size12 = changePageFontSize(12);
var size14 = changePageFontSize(14);
var size16 = changePageFontSize(16);

document.getElementById('size-12').onclick = size12;
document.getElementById('size-14').onclick = size14;
document.getElementById('size-16').onclick = size16;
```
2. 闭包模拟私有方法<br/>
   定义公共函数，使其可以访问（闭包中的）“私有”函数和变量。
```js
var Counter = (function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }
})();
// 两个计数器 Counter1 和 Counter2 是维护它们各自闭包
var Counter1 = makeCounter();
var Counter2 = makeCounter();
console.log(Counter1.value()); // log 0
// 各自改变各自闭包的词法环境，不会影响另一个闭包中的变量
Counter1.increment();
Counter1.increment();
console.log(Counter1.value()); // log 2
Counter1.decrement();
console.log(Counter1.value()); // log 1
console.log(Counter2.value()); // log 0
```
### 闭包回收
1. 引用闭包的函数是全局的变量<br/>
   闭包会一直存在直至页面关闭；若该闭包以后不再使用，会导致内存泄漏。
2. 引用闭包的函数是局部的变量<br/>
   当函数销毁后，下次JavaScript引擎执行垃圾回收的时候，判断闭包如果不再被使用，JavaScript引擎的垃圾回收器会回收这块内存。<br/>

使用闭包的原则：
1. 若该闭包一直会使用，可将其作为全局变量存在。
2. 使用频率不高，占用内存又大，尽量使其成为局部变量。

## 总结
* 通过作用域查找变量的链条称为作用域链
* 作用域链是基于词法词法作用域来确定的
* 词法作用域反映了代码结构
* 编译阶段，var声明存放到变量环境中，let、const声明存放到词法环境（栈）中
* 块级作用域查找路径：词法环境 -> 变量环境
* 闭包就是对词法作用域变量集合的引用 ≈ 外部词法作用域
### 面试Tip
在JavaScript中，根据词法作用域的规则，内部函数可以访问其外部函数中的变量。
若外部函数返回内部函数，即使外部函数执行完毕，但是内部函数仍然引用外部函数的变量，
这些变量的集合称之为闭包。
### 碎碎念
现在的理解觉得，闭包 ≈ 词法作用域，只是闭包里面存着的变量都是被内部函数所引用的变量。
