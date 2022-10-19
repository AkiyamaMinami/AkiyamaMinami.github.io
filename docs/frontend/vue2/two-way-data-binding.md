---
title: 双向绑定机制
categories:
 - Vue2
tags:
 - 双向绑定
 - ViewModel
 - MVVM
date: 2022-10-14
sidebar: 'auto'
---

## 前言
MVVM模型下，VM（ViewModel）控制层核心功能就是现实了**数据双向绑定**。
* 单向绑定 => 把Model绑定到View，使用JavaScript代码更新数据Model时，View就会自动更新。
* 双向绑定 => 在单向绑定的基础上，用户更新View，数据Model也自动更新。常见的表单输入数据绑定。
![MVVM双向绑定.png](https://s2.loli.net/2022/10/18/ujxTtAibyV57Fmg.png)

## 双向绑定
MVVM：
* Model => 数据、业务逻辑
* View =>  UI视图
* ViewModel => 关联数据和视图层（框架的核心）
### ViewModel
职责：
* 数据变化 => 更新视图
* 视图变化 => 更新数据

Vue中主要的构成：
* Observer：对数据进行观察监听（Model层处理）
* Compiler：扫描解析元素上的指令（v-model...），**根据指令替换模板数据、绑定更新函数**（View层指令系统处理）

## 实现流程
new Vue()进行初始化操作，合并配置、初始化生命周期、初始化事件中心、初始化渲染、初始化data、props、computed、watcher...等等，Vue把这些不同的功能逻辑拆成单独的函数进行执行，让整个主线初始化逻辑清晰。
```js
function Vue (options) {
  this._init(options)
}
Vue.prototype._init = function (options) {
  const vm = this
  // merge options
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) 
  initState(vm)
  initProvide(vm) 
  callHook(vm, 'created')
  vm.$mount(vm.$options.el)
}
```
重点关注 => **初始化data（initState）、初始化渲染（initRender）**。
1. new Vue()执行初始化，对data执行响应化处理，发生Observe中。
2. 对模板执行编译，编译动态绑定的数据，从data中获取并初始化渲染，编译指令同时绑定更新函数，发生在Compiler中。
3. 定义Watcher，将来data发生变化时通过Watcher来调用更新函数。
4. 由于data的某个key在⼀个视图中可能出现多次，所以每个key都需要⼀个管家Dep来管理多个Watcher。
5. 将来data⼀旦发生变化，会首先找到对应的Dep，通知所有Watcher执行更新函数。

### 初始化data
data的初始化主要做两件事：
* 遍历data函数返回对象的，通过proxy把每一个值vm._data.xxx都代理到vm.xxx上，实现通过vm._data.xxx访问data返回函数中对应的属性；
* 调用observe方法监测整个data的变化，变成响应式；
```js
function initState (vm) {
  const opts = vm.$options
  initProps(vm, opts.props)
  initMethods(vm, opts.methods)
  initData(vm)
  initComputed(vm, opts.computed)
  initWatch(vm, opts.watch)
}
function observe(obj) {  
  if (typeof obj !== "object" || obj == null) {  
    return;  
  }  
  // 给数据添加一个Observer实例
  new Observer(obj);  
}  
// 给对象的属性添加getter和setter，用于依赖收集和派发更新；
class Observer {  
  constructor(value) {  
    this.value = value;  
    this.walk(value);  
  }  
  walk(obj) {  
    Object.keys(obj).forEach((key) => {
      // 响应式处理
      defineReactive(obj, key, obj[key]);  
    });  
  }  
}  
```
#### 依赖收集
视图中会用到data中某个key，称为依赖。同⼀个key可能出现多次，每次都需要收集出来用⼀个Watcher来维护它们，此过程称为依赖收集。多个Watcher需要⼀个Dep来管理，需要更新时由Dep统⼀通知。
![依赖收集.png](https://s2.loli.net/2022/10/19/5NdW4Gfyq8XuVjx.png)
```js
function defineReactive(obj, key, val) {  
  const dep = new Dep();
  // Vue2使用的Object.defineProperty劫持数据的变化。
  Object.defineProperty(obj, key, {  
    // 依赖收集Watcher
    get() {
      // Dep.target也就是Watcher实例  
      Dep.target && dep.addDep(Dep.target);
      return val;  
    },  
    // 派发更新通知Watcher
    set(newVal) {  
      if (newVal === val) return;  
      // 通知dep执行更新方法  
      dep.notify(); 
    },  
  });  
} 
```
Watcher维护更新视图
```js
// 负责更新视图  
class Watcher {  
  constructor(vm, key, updater) {  
    this.vm = vm  
    this.key = key  
    this.updaterFn = updater  
    // 创建实例时，把当前实例指定到Dep.target静态属性上  
    Dep.target = this  
    // 读一下key，触发get  
    vm[key]
    // 置空  
    Dep.target = null  
  }  
  // 未来执行dom更新函数，由dep调用的  
  update() {  
    this.updaterFn.call(this.vm, this.vm[this.key])  
  }  
}  
```
Dep管理Watcher，Dep脱离Watcher单独存在是没有意义的。
```js
class Dep {  
  constructor() {  
    // 依赖管理 
    this.deps = [];   
  }  
  addDep(dep) {  
    this.deps.push(dep);  
  }  
  notify() {   
    this.deps.forEach((dep) => dep.update());  
  }  
}  
```
### 初始化渲染
对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数。
![模板编译.png](https://s2.loli.net/2022/10/19/RJqIPCf6D8mGX75.png)

## Vue2、Vue3数据绑定机制差异
主要的差异还是在数据的劫持方式。
* Vue2使用的是Object.defineProperty。
* Vue3使用的是Proxy => Proxy可以创建一个对象的代理，从而实现对object基本操作的拦截和自定义。
### Object.defineProperty限制
* 无法劫持新创建的属性 => Vue.set以创建新属性解决。
* 无法劫持数组的变化 => Vue自身对数组原生方法进行了劫持。
* 无法劫持直接索引修改数组 => 这个问题同样可以用Vue.set解决。
由于Vue3中改用Proxy实现数据劫持，Vue2中的Vue.set在Vue3中被移除。
## 总结
* 页面上数据发生变化，先找到对应Dep数据依赖，Dep通知对应所有Watcher进行更新。
* 使用发布订阅模式，定义对象之间一对多的依赖关系。data数据发生变化，所有依赖的Watcher都会被通知然后进行更新。
* 数据劫持方式：Vue2-Object.defineProperty、Vue3-Proxy。

