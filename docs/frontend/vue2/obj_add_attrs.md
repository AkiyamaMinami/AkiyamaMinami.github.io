---
title: 给对象添加新属性视图不更新？
categories:
 - Vue2
tags:
  - set
  - defineProperty
  - assign
  - forceUpdate
date: 2022-09-05
sidebar: 'auto'
---

## 前言
Vue不能监测对象的变化，无法检测property的添加或移除。<br/>
给响应式对象添加一个property，如果是**普通方式添加（this.myObject.newProperty = 'hi'）**，Vue是无法监测的，导致无法触发视图的更新。

## 产生原因
Vue2是通过**Object.defineProperty**实现数据响应式的，把传给data的对象所有属性全部转为**getter/setter**。<br/>
后续如果用普通方式给obj新增属性（obj.bar = '新属性'），新增的bar属性并不是响应式的，并没有通过Object.defineProperty设置成响应式。
[defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)<br/>
```js
const obj = {}
// 访问foo属性（get）or设置foo值（set）的时候触发getter和setter函数
Object.defineProperty(
  obj, 
  'foo', 
  {
        get() {
            console.log(`get foo:${val}`);
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log(`set foo:${newVal}`);
                val = newVal
            }
        }
  }
)
```
## 解决方案
Vue不允许在已创建的实例上动态添加新的响应式属性，要实现数据与视图同步更新，三种解决方案：
* Vue.set()
* Object.assign()
* $forceUpdate()
### Vue.set
Vue.set(target, propertyName/index, value)<br/>
Parameter:
* target: Object || Array
* propertyName/index: string || number 
* value: any

return: 设置的值<br/>
```js
function set (target: Array<any> | Object, key: any, val: any): any {
  // 对属性进行响应式处理
  defineReactive(ob.value, key, val)
  // 通知依赖
  ob.dep.notify()
  return val
}
// defineReactive内部借助Object.defineProperty实现属性拦截
function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log(`get ${key}:${val}`);
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log(`set ${key}:${newVal}`);
                val = newVal
            }
        }
    })
}
```
### Object.assign
直接使用Object.assign()添加到对象的新属性不会触发更新，**应创建一个新的对象，合并原对象和混入对象的属性**。
```js
// 代替Object.assign(this.someObject, { a: 1, b: 2 }) => 不会触发更新
this.someObject = Object.assign(
  {},
  this.someObject,
  {
    newProperty1:1
  }
)
```
### $forceUpdate
::: danger
如果发现需要在Vue中做一次强制更新，100%是在某个地方写的有Bug。<br/>
没有注意数组or对象的变化监测、依赖了一个未被Vue的响应式追踪的状态。
:::

$forceUpdate迫使Vue实例重新渲染<br/>
tip：仅仅影响实例本身和插入插槽内容的子组件，并非所有子组件。

## 总结
* 给对象添加少量的新属性，可以用Vue.set()。
* 给对象添加大量的新属性，可以用Object.assign()**创建新对象**。
* 实在不行，$forceUpdate()进行强制刷新。
* Vue3是用过proxy实现数据响应式的，直接动态添加新属性是可以实现数据响应式。