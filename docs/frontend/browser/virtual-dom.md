---
title: 为何出现虚拟DOM？
categories:
 - Browser
tags:
 - Virtual Dom
date: 2022-10-11
sidebar: 'auto'
---

## 前言
DOM本身其实是有一些缺陷的，虚拟DOM的出现就是为此而诞生的，React、Vue都使用了虚拟DOM技术。

## DOM缺陷
需要先了解**DOM树生成**相关知识：
* [JavaScript影响DOM树构建](./render-process-js-dom-tree.md)

DOM提供了一组JavaScript接口用于操作树节点的，**JavaScript操作DOM会影响到整个渲染流水线。**可能触发：
* 重排：样式计算、布局、绘制、栅格化、合成more...
* 重绘
* 合成
* 强制同步布局
* 布局抖动
对于复杂的页面，修改DOM树，执行一次重排or重绘等等都是非常耗时的，导致性能问题。
:::tip
需要一种方案减少JavaScript对DOM的操作 => 虚拟DOM
:::

## 虚拟DOM

### 要做的事情
* 页面发生变化的内容作用到虚拟DOM上，而非直接作用到DOM上。
* 变化作用到虚拟DOM上，不直接应用到DOM渲染页面，只调整虚拟DOM内部状态（操作虚拟DOM代价变低）。
* 当虚拟DOM收集到足够的变化，再一次性将这些变化作用到真实DOM。

### React虚拟DOM
* 创建虚拟DOM => 数据、JSX创建虚拟DOM，虚拟DOM创建真实DOM，触发渲染流程输出页面。
* 更新虚拟DOM => 数据变化，根据新数据创建一个新的虚拟DOM，React进行新旧虚拟DOM对比，找出变化的点，将变化的点一次性更新到真实DOM，触发渲染引擎更新流程输出新页面。
![React虚拟DOM流程](https://s2.loli.net/2022/10/11/FXZWiavtzLeqh32.png)

### React Fiber
React在新旧虚拟DOM比较的过程中，是在一个递归函数中执行的（算法reconciliation）。一般情况这个过程执行比较快，但是当虚拟DOM本身也很复杂的时候，**执行比较函数有可能占据主线程很久**，这样会导致其他任务等待，页面会卡顿。为了解决这个问题，React重写reconciliation算法（Stack reconciler），改新算法Fiber reconciler。<br/>
Fiber可以和协程关联起来，算法Fiber reconciler是在**执行过程中能够出让主线程**，避免函数占用过久的问题。
[关于协程一些点](../javascript/async-await.md)

## 设计模式

### 双缓存
开发游戏或处理其他图像的过程中，屏幕从前缓冲区读取数据然后显示。但很多图形都很复杂且需要大量运算，比如一幅完整的画面，可能需要计算多次才能完成，如果每次计算完一部分图像，就将其写入缓冲区，那么会造成一个后果，就是在显示一个稍微复杂点的图像的过程中，会看到的页面效果可能是一部分一部分地显示出来，在页面刷新的过程中，会让用户感到画面闪烁。<br/>
使用双缓存，先将计算的中间结果存放在另一个缓冲区，等全部的计算结束，该缓冲区已经存储了完整的图形，再将该缓冲区的图形数据一次性复制到显示缓冲区，这样使得整个图像的输出非常稳定。<br/>
**可以把虚拟DOM看成是DOM的一个buffer**，和图形显示一样，会在完成一次完整的操作之后，再去把结果应用到DOM上，能减少一些不必要的更新，同时还能保证DOM的稳定输出。

### MVC模式
MVC将数据和视图进行分离，面对复杂项目，大大降低项目耦合度，便于维护。<br/>
核心点：
* 数据和视图分离，不允许直接通信。
* 通信通过控制器来完成。

一般的通信路径 => 视图发生变化，通知控制器，控制器判断是否更新数据模型。基于MVC演变出MVP（Model-View-Presenter）、MVVM。
![MVC设计模式](https://s2.loli.net/2022/10/11/uL8WilEBY21tSVy.png)

### React + Redux => MVC
React（虚拟DOM）=> View视图
Redux => Model数据模型 + Controller控制器<br/>
* 控制器监听DOM变化，DOM发生变化事件，控制器通知模型更新数据；
* 模型数据更新完毕，控制器通知视图模型数据发生了变化；
* 视图接收到通知，根据模型数据生成新虚拟DOM；
* 新旧虚拟DOM进行比较，找出变化的节点；
* 变化的虚拟DOM => 作用到DOM触发更新；
* DOM变化触发渲染流程；
![React Redux MVC](https://s2.loli.net/2022/10/12/L4Ckv37DgzMxBT5.png)

## 总结
* 操作DOM会触发一系列渲染流程；
* 虚拟DOM减少了一些对DOM不必要的操作；
* 虚拟DOM是双缓存思想的一种体现，解决页面的无效刷新和闪屏；


