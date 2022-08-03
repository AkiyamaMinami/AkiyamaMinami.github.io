---
title: JavaScript -- 变量提升是在做啥子？
sidebar: 'auto'
date: 2022-08-03
categories:
 - FrontEnd
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
