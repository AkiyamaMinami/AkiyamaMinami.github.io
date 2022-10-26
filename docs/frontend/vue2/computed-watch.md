---
title: Computed/Watch
categories:
 - Vue2
tags:
 - computed
 - watch
date: 2022-10-26
sidebar: 'auto'
---
## 前言
Computed：
* 用于模板表达式的声明，创建一个新的响应式数据。
* 缓存特性（只有依赖的响应式数据变化才会重新计算），相较于methods不必每次执行计算。
* 适合处理复杂逻辑的模板表达式。

Watch：
* 用于给响应式数据增加自定义监听器，监听响应式数据变化。
* 适合处理异步、开销比较大的场景。

[计算属性和监听器](https://v2.cn.vuejs.org/v2/guide/computed.html)

## Computed
Computed类似Vue双向绑定的机制，创建数据并设置Getter。
```js
computed: {
  fullName: {
    // 默认只有getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```
渲染更新流程：
1. 初始化阶段：Vue初始化 => 初始化computed属性 => 构造Lazy Watcher（[双向绑定的Watcher](./two-way-data-binding.md)）
2. 首次模板渲染：检测到Computed属性 => 调用Getter => 链式调用依赖的响应式数据Getter => 保存引用依赖关系 => Lazy Watcher缓存计算结果 => 返回模板渲染
3. 再次模板渲染：直接取Lazy Watcher中的缓存值进行渲染。
4. 依赖的响应式数据发生更新：根据保存的引用依赖关系向上通知Lazy Watcher进行重新计算，缓存计算结果并通知重新渲染页面。

## Watch
Watch本质是给响应式属性的Setter增加一个自定义Watcher。当属性更新，调用传入的回调函数。<br/>
配置项：
* deep：对象属于引用类型，实现监听对象的每一个属性创建一个watcher，确保每个属性更新都能触发回调。
* immediate：初始化时直接调用回调函数（在created阶段手动调用回调函数也能实现该效果）
