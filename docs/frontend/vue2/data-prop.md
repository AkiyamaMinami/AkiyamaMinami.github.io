---
title: 组件data属性必须是函数？
categories:
 - Vue2
tags: 
  - 根组件
  - 子组件
  - Vue实例
date: 2022-10-28
sidebar: 'auto'
---

## 前言
Vue实例（根组件）定义data属性可以是函数or对象。[Vue组件](https://v2.cn.vuejs.org/v2/guide/components.html)
```js
const app = new Vue({
    el:"#app",
    // 对象
    data:{
      foo:"foo"
    },
    // 函数
    data(){
      return {
        foo:"foo"
      }
    }
})
```
Vue组件（**可复用的Vue实例**）data属性必须是一个函数，让每个实例可以维护一份独立拷贝的返回对象，避免互相影响。
```js
// 报错警告 => 每一个组件实例中返回的data应该是一个函数。
Vue.component('component1',{
    template:`<div>组件</div>`,
    data:{
      foo:"foo"
    }
})
```
## 定义为函数或对象的区别
描述好一个组件选项 => Vue最终会通过构造器Vue.extend(自己描述的组件选项) => 生成一个子类Component构造器 => new 子类Component => 生成一个组件实例。<br/>
如果描述的data是对象，Vue去构造的时候不会帮你创建新的对象，导致创建多个Vue实例的data的对象都是共享一个内存地址的。如果是函数形式自己手动创建一个新对象，这样Vue去创建的实例的data的值都是新的，不会互相影响。
```js
// data是对象的方式
function Component(){}
// 对象共用了同一个内存地址 => 生成的组件实例之间互相影响
Component.prototype.data = {
	count : 0
}
// data是函数的方式
function Component(){
	this.data = this.data()
}
Component.prototype.data = function (){
    // 函数返回的对象内存地址并不相同
    return {
   		count : 0
    }
}
```

## 总结
* JavaScript对象引用类型的值是存到堆中的，存在互相影响的现象。[JavaScript堆栈存储](../javascript/stack-heap-store.md)
* Vue自身创建实例的过程并不会帮你手动创建一个新对象，需要我们自己传入函数的形式每次为data生成一个新对象，防止互相影响