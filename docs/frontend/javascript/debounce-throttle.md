---
title: Case -- 防抖、节流
categories:
 - JavaScript
tags:
 - debounce
 - throttle
date: 2022-08-16
sidebar: 'auto'
---

## 前言
**本质上是优化高频率执行代码的一种手段。**<br/>
浏览器的一些场景，会出现不断调用某事件绑定的回调函数，造成资源浪费：
* 窗口大小resize
* 监听输入框用户输入
* 页面滚动加载
* 搜索框输入联想

为了提高前端的性能，需要**降低对此类事件调用频率**，常见的两种手段：
* 防抖（debounce）
* 节流（throttle）

## 防抖
N秒后执行函数，若在N秒内函数被再次触发，**重新计时**N秒。<br/>
比喻：电梯开关门，电梯5秒后会关门，若5秒内有人进来，5秒重新计时。
```js
function debounce(fn, time) {
  // 定时器
  let timer = null
  return function() {
    // 再次触发都要重新计时
    if(timer !== null) {
      clearTimeout(timer)
    }
    // N秒后执行
    let context = this
    let args = arguments
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, time)
  }
}
```
场景：
* 搜索框联想。
* 手机号、邮箱校验。
* 窗口大小resize。等待窗口调整完成后，再去进行回调处理。

## 节流
**N秒内只运行一次**，若N秒内再次触发，只执行一次。<br/>
比喻：水龙头出水，不管你水池的水量多大，每分钟水龙头出水量是固定的。
```js
function throttle(fn, interval) {
  // 开始执行的时刻
  let prevTime = Date.now()
  return function() {
    let nextTime = Date.now()
    let context = this
    let args = arguments
    // 下次执行的时刻跟开始执行的时刻间隔大于了节流间隔
    if(nextTime - prevTime >= interval) {
      fn.apply(context, arguments);
      prevTime = Date.now()
    }
  }
}
```
场景：
* 下拉滚动加载，滚到底部监听。
* 搜索框联想。

## 总结
* 防抖 => N秒后执行函数，若在N秒内函数被再次触发，重新计时N秒。
* 节流 => N秒内只运行一次，若N秒内再次触发，只执行一次。


