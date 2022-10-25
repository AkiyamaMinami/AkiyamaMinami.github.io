---
title: setTimeout
categories:
 - JavaScript
tags:
 - setTimeout
date: 2022-08-24
sidebar: 'auto'
---

## 前言
* 一个定时器，指定某函数多少ms后执行。
* return 一个整数代表定时器的编号。
* 通过编号可以取消定时器。
```js
function foo() {
    console.log('hi~')
}
// 1秒后调用foo函数
let timer = setTimeout(foo, 1000)
// clearTimeout(timer)
```

## 浏览器如何实现setTimeout
渲染进程中主线程去执行任务的机制：
1. 任务添加到消息队列
2. 主线程依赖**事件循环去按照顺序执行消息队列中的任务**<br/>

常见的事件（**事件其实就可以概括认为是任务**，循环监听事件发生，一旦发生，产生任务进入消息队列，等待执行）：
* 接收到HTML文档数据 => 渲染引擎将“解析DOM”事件（任务）添加到消息队列。
* 用户改变浏览器窗口大小 => 渲染引擎将“重新布局”的事件添加到消息队列。
* 触发JavaScript引擎垃圾回收机制 => 渲染引擎将“垃圾回收”任务添加到消息队列中。<br/>
**注意：为什么JavaScript垃圾回收的任务被渲染引擎接手了？**
* 执行一段异步JavaScript代码 => 将执行任务添加到消息队列中。
### 定时器的特殊性
定时器需要指定时间间隔然后调用，而消息队列中的任务是按照顺序执行的，所以定时器的回调函数不能直接添加到消息队列中。<br/>
Chrome中除了正常使用的消息队列，额外还有一个消息队列，该队列中维护了**需要延迟执行的任务**（定时器、Chrome内部延迟任务）。每当JavaScript创建一个定时器，渲染进程将该定时器的回调函数任务添加到**延迟队列**中。
### 事件循环系统执行延迟队列
* 每当处理完消息队列中的一个任务之后；
* 到延迟队列中根据**发起时间、延迟时间计算出到期任务**，依次执行到期任务；
* 到期任务执行完成，继续上述的下一个循环；
### 定时器删除
设置定时器，JavaScript引擎会返回一个定时器的ID。<br/>
一般情况，当一个定时器的任务暂未执行，是可以取消的，调用**clearTimeout**函数，并传入需要取消的定时器的 ID。<br/>
浏览器内部如何实现：根据ID**从延迟队列中找到对应任务**，将其删除即可。
### 使用setTimeout注意点
* setTimeout设置的回调函数中的this。<br/>
如果setTimeout延迟执行的回调函数是某对象的方法，那么该方法中的**this关键字将指向全局环境**。
```js
let name= 1;
let obj = {
  name: 2,
  showName: function(){
    console.log(this.name);
  }
}
// 这段代码在编译的时候，执行上下文中的this会被设置为全局window对象
// log 1
setTimeout(obj.showName,1000)
// ====解决this指向====
// 箭头函数包装
setTimeout(() => {
    obj.showName()
}, 1000);
// function函数包装
setTimeout(function() {
  obj.showName();
}, 1000)
// bind绑定
setTimeout(obj.showName.bind(obj), 1000)
```
* 当前任务执行过久，会影响到期的定时器任务执行。
```js
function timer() {
    console.log('timer run')
}
function test() {
    // timer回调任务放入延迟队列等待执行
    // 无法立即执行，需要等待当前任务执行完成
    setTimeout(timer, 0);
    // 当前任务执行该循环消耗时长肯定是不止0ms的
    // 所以影响到setTimeout 0ms后执行
    for (let i = 0; i < 10000; i++) {
        let j = 1 * 2
        console.log(j)
    }
}
test()
```
* **setTimeout嵌套调用，系统会设置最短时间间隔为4ms**。
```js
function cb() { setTimeout(cb, 0); }
setTimeout(cb, 0);
```
Chrome中，定时器被嵌套调用5次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于4ms，那么浏览器会将每次调用的时间间隔设置为4ms。<br/>
所以**一些实时性较高的需求**不太适合使用setTimeout，用setTimeout来实现 JavaScript动画不是很合适。
* **未激活的页面，setTimeout执行最小间隔是1000ms。**<br/>
如果tab标签不是当前激活的标签，那么定时器最小的时间间隔是1000ms。
目的是**优化后台页面的加载损耗以及降低耗电量**，要注意下。
* **延时执行时间有最大值（2147483647毫秒 约24.8天）。**<br/>
Chrome、Safari、Firefox都是以32个bit来存储延时值的，32bit最大只能存放的数字是 2147483647毫秒，如果setTimeout设置的延迟值大于2147483647毫秒（约 24.8 天）时就会溢出，这导致定时器会被**立即执行**。

## 总结
* 除了一般的消息队列，浏览器增加了**延时队列**，支持定时器的实现。
* 消息队列排队和系统级别的限制，setTimeout设置的回调任务并非可以总是按照给定的时间被执行，不能满足一些实时性要求较高的需求。
* 使用setTimeout，要注意其给定延时时间的一些特殊情况，this的指向。