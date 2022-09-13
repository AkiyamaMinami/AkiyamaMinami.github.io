---
title: async/await
categories:
 - JavaScript
tags:
 - async
 - await
date: 2022-09-07
sidebar: 'auto'
---

## 前言
Promise解决的异步编码回调编写风格（回调地狱）问题，但是流程再复杂，代码有可能充斥着Promise的then()方法，又语义化不明显，代码很难读得懂。~~其实我觉得还好啦（🏃~~
Promise.then可以让整个流程看起来线性化，但这种链式风格依旧还是很难去阅读。<br/>
所以ES7引入async/await，JavaScript异步编程得到更大的提升，**提供了在不阻塞主线程的情况下使用同步代码实现异步访问资源的能力**，让代码看起来也很易读。<br/>
async/await使用了生成器（Generator）和Promise两种技术。

## 生成器Generator、协程Coroutine

### 生成器函数
生成器函数是一个带星号函数，是**可以暂停执行和恢复执行**的。
```js
function* genDemo() {
    console.log(" 开始执行第一段 ")
    yield 'generator 1'
 
    console.log(" 开始执行第二段 ")
    yield 'generator 2'
 
    console.log(" 开始执行第三段 ")
    yield 'generator 3'
 
    console.log(" 执行结束 ")
    return 'generator 4'
}
console.log('main 0')          
let gen = genDemo()
console.log(gen.next().value)  
console.log('main 1')          
console.log(gen.next().value)  
console.log('main 2')          
console.log(gen.next().value)  
console.log('main 3')          
console.log(gen.next().value) 
console.log('main 4')          
> "main 0"
> " 开始执行第一段 "
> "generator 1"
> "main 1"
> " 开始执行第二段 "
> "generator 2"
> "main 2"
> " 开始执行第三段 "
> "generator 3"
> "main 3"
> " 执行结束 "
> "generator 4"
> "main 4"
```
genDemo生成器函数不是一次执行完毕的，全局代码和genDemo函数交替执行，这就是生成器函数的特性，可以暂停、恢复执行。<br/>
生成器函数的使用方式：
* 生成器函数内部执行一段代码，如果遇到yield关键字，那么JavaScript引擎将返回关键字后面的内容给外部，并暂停该函数的执行。
* 外部函数可以通过next方法恢复函数执行。

### V8引擎通过协程实现函数的暂停恢复
在JavaScript中，**生成器是协程的一种实现方式**。<br/>
协程是一种比线程更加轻量级的存在。可以把协程看成是跑在线程上的任务，**一个线程上可以存在多个协程，但在线程上同时只能执行一个协程**。<br/>
线程和协程：
* 当前执行A协程，需要启动B协程，A协程需要将主线程控制器交给B协程。A协程暂停，B协程恢复执行。
* 一般来说，从A协程启动B协程，A称之为B的父协程。
* 类似一个进程多个线程，一个线程多个协程。区别在于协程不是被操作系统内核管理，是由程序所控制的（用户态执行）。
* 协程好处就是提升性能，不像线程切换消耗的资源多。<br/>

协程的四点规则：
* 通过调用生成器函数genDemo来创建一个协程gen，创建之后，gen协程**并没有立即执行**。
* 要让gen协程执行，需要通过调用gen.next。
* 当协程正在执行的时候，可以通过**yield关键字来暂停gen协程**的执行，并返回主要信息给父协程。
* 如果协程在执行期间，遇到了**return关键字，那么JavaScript引擎会结束当前协程**，并将return后面的内容返回给父协程。
![线程-协程](https://s2.loli.net/2022/09/07/MfjlJ5KbXLcO97N.png)

每个协程都有各自的调用栈，**引擎是如何切换调用栈**的？关注两点：
1. gen协程和父协程是在主线程上交替执行的，**不是并发执行的**，协程之前的切换是通过yield和gen.next来完成的。
2. 当在gen协程中调用了yield，引擎保存gen协程当前的调用栈信息，并恢复父协程的调用栈信息。同样，父协程中执行gen.next时，引擎会保存父协程的调用栈信息，并恢复gen协程的调用栈信息。

### 生成器和Promise实现同步代码形式完成异步操作
```js
// 同步代码形式发送异步请求
function* foo() {
    // 调用fetch创建了一个Promise对象response1
    // 通过yield暂停协程的执行，并将response1返回给父协程
    let response1 = yield fetch('https://mobs.fun')
    let response2 = yield fetch('https://mobs.fun/1')
}
// 创建了gen协程
let gen = foo()
// 执行gen协程
function getGenPromise(gen) {
    // 父协程中执行gen.next把主线程的控制权交给gen协程
    return gen.next().value
}
// 父协程恢复执行后调用response1.then方法等待请求结果
getGenPromise(gen).then((response) => {
    // fetch发起的请求完成，then中的回调函数拿到结果
    console.log(response)
    // 调用gen.next放弃主线程的控制权，将控制权交gen协程继续执行下个请求
    return getGenPromise(gen)
}).then((response) => {
    console.log(response)
})
```

## async/await
生成器已经能很好地满足需求了，ES7中引入了async/await，这种方式能够生成器，实现更加直观简洁的代码。<br/>
async/await技术背后的秘密就是Promise和生成器应用，往低层说就是**微任务和协程应用**。
### async
MDN定义：async是一个**异步执行**并**隐式返回Promise**作为结果的函数。
```js
async function foo() {
    return 2
}
// 隐式返回 => Promise {<resolved>: 2}
console.log(foo())
```
### await
```js
async function foo() {
    console.log(1)
    let a = await 100
    console.log(a)
    console.log(2)
}
console.log(0)
foo()
console.log(3)
```
* 首先父协程执行console.log(0)语句。
* foo()被async标记，所以进入该函数会启动foo协程（JS引擎保存当前调用栈等信息）。
* 执行console.log(1)语句。
* 执行await 100，会创建Promise对象如下：
  ```js
  let promise = new Promise((resolve,reject){
    resolve(100)
  })
  ```
 promise对象创建的时候，在executor函数中调用了**resolve函数，JS引擎会将该任务提交给微任务队列**。
* JS引擎暂停当前foo协程的执行，将主线程的控制权转交给父协程执行，同时会将promise对象返回给父协程。
* 主线程的控制权交给父协程，此时父协程需要调用promise.then来监控promise状态的改变。
* 继续执行父协程的流程，执行console.log(3)。
* 父协程将执行结束，在结束之前，**会进入微任务的检查点，执行微任务队列**，微任务队列中有resolve(100)的任务等待执行，执行到这里的时候，触发promise.then中的回调函数如下：
  ```js
  promise_.then((value)=>{
    // 回调函数被激活后
    // 将主线程控制权交给foo协程，并将vaule值传给协程
  })
  ```
* foo协程激活后，会把刚刚的value值赋给了变量 a，然后foo协程继续执行后续语句，执行完成之后，将控制权归还给父协程。

## 总结
* Promise的编程模型解决了回调地狱的问题，但在语义方面依然存在缺陷，**充斥着大量的then方法**，这就是 async/await出现的原因。
* 使用async/await可以**实现用同步代码的风格来编写异步代码**。
* async/await基础技术使用了**生成器 + Promise**，**生成器是协程的实现，利用生成器能实现生成器函数的暂停和恢复**。
* V8引擎为async/await做了大量的语法层面包装，使用它不仅能让代码更加整洁美观，而且还能确保该函数始终都能返回Promise。