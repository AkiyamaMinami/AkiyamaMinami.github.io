---
title: 变量提升
sidebar: 'auto'
date: 2022-08-03
categories:
 - JavaScript
tags:
 - Hoist
---
 
## 前言
当JavaScript代码执行的时候，会出现变量提升的情况。<br/>
让我们来看一段代码~
```js
logName()
console.log(name)
var name = 'mobs'
function logName() {
    console.log('执行logName函数');
}
```
惯性去思考🤔，代码应该是按顺序去执行：
* 第一行去执行logName函数，但是发现还没有关于logName函数的定义，执行会报错
* 第二行去打印name变量，但发现还没有name的定义，执行会报错 <br/>
但是实际这段JavaScript代码执行的结果是：
```
> "执行logName函数"
> undefined
```
可以看出：
* 变量在定义之前使用，不会报错，但该变量的值会被赋值为undefined，并非其定义时的值。
* 函数在定义之前使用，不会报错，并且能正确的执行。
所以为啥能在定义之前去使用呢？需要知道变量提升。

## 变量提升（Hoist）

### 定义
变量提升是指，JavaScript代码在执行的时候，JavaScript引擎会把**变量的声明、函数的声明**的这些代码，提升到整个代码的开头。当变量**被提升**，会给变量设置默认值**undefined**。

### JavaScript中的声明和赋值
```js
var name = 'mobs'
```
我们可以拆解一下：
```js
// 声明
var name
// 赋值
name = 'mobs'
```
继续看下函数的声明和赋值
```js
// 函数声明
function test(){
  console.log('test')
}
// ---------------
var test1 = function(){
  console.log('test1')
}
// 拆解如下↓↓↓↓↓↓↓↓
// 声明
var test1 = undefined
// 赋值
test1 = function(){
  console.log('test1')
}
```

### JavaScript引擎如何处理相同函数名如何处理？
**如果定义了两个相同名字的函数，生效的是最后一个定义的函数。**

## 纵观JavaScript代码执行的流程
“变量提升”是JavaScript代码执行过程中的一个行为，变量和函数的声明的代码看上去
会被移动到代码的最前面。但是实际上变量、函数声明的**代码所在的位置并不会真的去改变**，仅仅是在**编译阶段**被JavaScript引擎放到了内存中。<br/>
概括代码流程：
> **代码 => 编译 => 执行**

### 编译
代码编译后产生：
1. 执行上下文（Execution context）
2. 可执行代码（字节码）<br/>

执行上下文就是JavaScript代码运行的环境（抽象理解要记住），函数的调用就会产生一个执行上下文，代码执行就会进入执行上下文。<br/>
执行上下文包含的信息：
* 变量对象 => **这个对象里面就保存着变量提升的内容**
  ```js
  变量对象: {
    name: undefined,
    test: function() { console.log('test') }
  }
  ```
  **函数定义会被存储到堆（Heap）中，变量对象test属性会指向堆中的函数。**
* 作用域链
* this

**对于声明以外的代码，JavaScript引擎会将其编译为字节码。**

### 执行
JavaScript引擎配合执行上下文开始按照顺序执行可执行代码（字节码）。

## 总结
* JavaScript代码执行的时候，需要先编译、再执行，编译时会进行变量提升。
* 编译阶段，变量、函数的声明会被保存到执行上下文的变量对象中。
* 执行阶段，JavaScript配合执行上下文去执行代码。
