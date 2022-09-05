---
title: XMLHttpRequest
categories:
 - JavaScript
tags:
 - Callback
 - XMLHttpRequest
 - XHR
date: 2022-08-25
sidebar: 'auto'
---

## 前言
XMLHttpRequest出现之前，若服务器数据更新，是需要重新刷新整个页面的。<br/>
XMLHttpRequest提供了从服务器获取数据的能力，想更新数据，通过XMLHttpRequest请求服务器提供的接口获取到数据，操作DOM更新页面，这样就实现了局部刷新，提高效率和用户体验。<br/>
XMLHttpRequest**回调函数机制实现异步获取服务端数据和状态**。

## 回调函数
**一个函数作为参数传递给另一个函数，作为参数的函数被称为回调函数（Callback Function）。**
### 同步回调
回调函数callback是在函数foo返回之前执行的，这种回调过程称为同步回调。
```js
let callback = function(){
    console.log('callback run~')
}
function foo(cb) {
    console.log('foo start')
    cb()
    console.log('foo end')
}
foo(callback)
```
### 异步回调
回调函数callback并没有在foo函数内部被调用，**当回调函数在所执行函数外部执行的过程称为异步回调**。
```js
let callback = function(){
    console.log('callback run~')
}
function foo(cb) {
    console.log('foo start')
    setTimeout(cb, 1000)
    console.log('foo end')
}
foo(callback)
```

## 系统调用栈
浏览器页面通过**事件循环 + 消息队列**机制来驱动，主线程按照顺序去执行消息队列中的事件。<br/>
每当循环系统在执行一个任务的时候，会创建一个**系统调用栈**来维护该任务，类似于JavaScript的执行调用栈。每个任务在执行的过程中都有自己的调用栈。~~怎么哪哪儿都是开栈维护秩序啊，是真的🐂🍺~~<br/>
**系统调用栈解决了大任务执行过程中去执行各种小任务后，依旧能继续大任务的流程，栈具有记忆的功能。**<br/>
比如执行消息队列中的“Parse HTML”任务过程中：<br/>
会遇到很多子任务，解析页面的过程中遇到JavaScript脚本，需要暂停解析去执行JavaScript脚本，等待执行完毕，继续恢复解析页面的过程，又遇到样式文件，继续暂停解析去解析样式表...直至整个“Parse HTML”任务完成。<br/>
同步回调正常在执行函数的上下文中执行，**异步回调在执行函数的上下文之外去执行，一般有两种形式**：
* 将异步回调函数作为任务（**宏任务**），添加到消息队列队尾。
* 将异步回调函数作为**微任务**，添加到微任务队列队尾，这样就可以在当前任务末尾执行微任务。

## XMLHttpRequest执行机制
### 概览
![XHR流程 _1_.png](https://s2.loli.net/2022/08/25/dCtOmNeyA7GxTap.png)
### 用法
1. **创建XMLHttpRequest对象。**<br/>
  let xhr = new XMLHttpRequest()，JavaScript创建一个XMLHttpRequest对象xhr，用来执行实际的网络请求操作。
2. **为xhr对象注册回调函数。**<br/>
   因为网络请求比较耗时，所以要注册异步回调函数，后台任务执行完毕后根据拿到的状态数据通过对应的回调函数来告诉其执行结果。常见的几种回调函数：
   * ontimeout => 监控后台请求超时
   * onerror => 监控后台请求出错
   * onreadystatechange => 监控后台请求过程中的状态
3. **配置基础请求信息**
   * 通过open配置一些基础的请求信息 => 请求的地址、请求方法（get or post）、请求方式（同步 or 异步）。
   * xhr内部属性 => timeout（超时时间）、responseType（配置服务器返回的数据格式，比如设置为json，系统会将服务器返回的数据转换为JavaScript对象格式）
   * setRequestHeader => 设置请求头属性
4. **发起请求**
   * 渲染进程将请求发送给网络进程。
   * 网络进程负责资源的下载。
   * 网络进程接收到服务器数据之后，利用IPC来通知渲染进程。
   * 渲染进程接收到消息之后，将xhr的回调函数封装成任务并添加到消息队列中。
   * 主线程事件循环系统执行到该任务的时候，根据相关的数据状态来调用对应的回调函数。
   * 网络请求出错了 => 执行onerror。
   * 超时了 => 执行ontimeout。
   * 正常的数据接收 => 执行onreadystatechange来反馈相应的状态。
```js
function getData(apiUrl){
  // 1: new XMLHttpRequest请求对象
  let xhr = new XMLHttpRequest()

  // 2: 注册相关事件回调处理函数 
  xhr.onreadystatechange = function () {
      switch(xhr.readyState){
        // 请求未初始化
        case 0: 
          console.log(" 请求未初始化 ")
          break;
        // OPENED
        case 1:
          console.log("OPENED")
          break;
        // HEADERS_RECEIVED
        case 2:
          console.log("HEADERS_RECEIVED")
          break;
        // LOADING  
        case 3:
          console.log("LOADING")
          break;
        // DONE
        case 4:
          if(this.status == 200||this.status == 304){
              console.log(this.responseText);
          }
          console.log("DONE")
          break;
      }
  }
  xhr.ontimeout = function(e) { console.log('ontimeout') }
  xhr.onerror = function(e) { console.log('onerror') }

  // 3: 打开请求
  // 创建一个Get请求, 采用异步
  xhr.open('Get', apiUrl, true);

  // 4: 配置参数
  // 设置 xhr 请求的超时时间
  xhr.timeout = 3000 
  // 设置响应返回的数据格式
  xhr.responseType = "text" 
  // 设置响应请求头
  xhr.setRequestHeader("TEST")

  // 5: 发送请求
  xhr.send();
}
```
### 注意点
浏览器安全策略的限制，导致使用XHR有很多问题。
1. 跨域
   在A站点中去访问不同源的B站点的内容，默认情况下，跨域请求是不被允许的。
2. HTTPS混合HTTP内容
   HTTPS请求页面中通过HTTP加载图片、视频、样式表、脚本等资源，会有warning警告。用 XMLHttpRequest请求时，浏览器认为这种请求可能是攻击者发起的，有可能会阻止此类危险的请求。

## 总结
* 消息队列中的任务执行的时候，会创建系统调用栈去维护该任务。
* 异步回调函数可以作为任务，添加到消息队列。
* 异步回调函数可以作为微任务，添加到微任务队列。
* setTimeout直接把延迟任务添加到延迟队列，XHR发起请求，会经过浏览器其他进程去执行，经由IPC来跟渲染进程通信，把获取的数据和回调函数封装为任务添加到渲染进程的消息队列。
* XHR配合回调函数机制，实现异步获取服务端数据和状态。
* XHR跨域，HTTPS混合问题。
