---
title: Web Components
categories:
 - Browser
tags:
 - Custom elements
 - Shadow DOM
 - HTML templates
 - 组件化
date: 2022-10-12
sidebar: 'auto'
---

## 前言

### 组件化
稍微复杂的项目，涉及到**多人协作开发**的问题，每个人尽可能独立负责自己的功能模块（组件），组件内部状态不能影响别人的组件，如果需要通信交互提前协商好接口。**组件化降低了整个系统的耦合度，也降低了开发者之间沟通的复杂度**。<br/>
:::tip
对内高聚合，对外低耦合。</br>
对内各个元素之间相互依赖结合，对外和其他组件通信接口简单。
:::
很多语言天生对组件化有很好的支持，基于编程语言特性，一般都会有块级作用域、函数作用域、类，能够将内部状态数据隐藏在作用域之下或对象内部，让外部无法访问，通过约定好的接口和外部通信。JavaScript（函数作用域、块级作用域）也能很好的实现组件化。

### 前端组件化的阻碍
前端三剑客（HTML + CSS + JavaScript），在大型项目下维护的难点：
* CSS全局属性 => 渲染引擎会将所有的CSS内容进行解析为CSSOM，布局树配合CSSOM为元素查找样式，所以同样的标签最终渲染的效果是一样的，渲染引擎无法单独设置样式。
* DOM唯一性 => 任何地方都有可能修改DOM

## Web Components
Web Components给出了一套解决方案，它提供了**对局部视图封装能力**，能让DOM、CSSOM、JavaScript运行在局部环境中，使得局部的CSS和DOM不会影响到全局。[MDN - Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
* Custom elements（自定义元素）
* Shadow DOM（影子 DOM）
* HTML templates（HTML 模板）
```html
<!DOCTYPE html>
<html>
    <body>
        <!-- 
            1. 定义HTML模板
            2. 定义内部CSS
            3. 定义JavaScript行为 
        -->
        <template id="mobs-comp-id">
            <div>233</div>
            <style>
                div {
                    width: 100px;
                    background-color: skyblue; 
                }
            </style>
            <script>
               function test() {
                   console.log('wuhu')
               }
            </script>
        </template>
        <script>
            class MobsComp extends HTMLElement {
               constructor() {
                   super()
                   // 获取组件模板
                   const content = document.querySelector('#mobs-comp-id').content
                   // 创建影子DOM节点
                   const shadowDOM = this.attachShadow({ mode: 'open' })
                   // 将模板添加到影子DOM上
                   shadowDOM.appendChild(content.cloneNode(true))
               }
            }
            customElements.define('mobs-comp', MobsComp)
        </script>
        <!-- 使用自定义组件 -->
        <mobs-comp></mobs-comp>
        <div>🛫</div>
    </body>
</html>
```
使用Web Components一般的三个步骤：
1. 使用template标签来创建模板，template元素是不会被渲染到页面上的（**DOM树中的template节点不会出现在布局树中**）。但是可以利用DOM查找template的内容。一般使用template来自定义一些基础的元素结构（就变得可复用了）。template定义好之后，可以在template的内部定义样式信息。
2. 创建一个自定义组件的Shadow DOM的类。在类的构造函数中要完成三件事：
   * 查找template内容；
   * 创建Shadow DOM；
   * 将template添加到Shadow DOM上；
3. 使用customElements.define来自定义元素。
### Shadow DOM
Shadow DOM的作用是**将template中的内容与全局DOM、CSS进行隔离**，实现元素和样式的私有化封装。
:::tip
可以把Shadow DOM看成是一个作用域，其内部的样式和元素不会影响到全局的样式和元素的，而在全局环境下，要访问Shadow DOM内部的样式或者元素也是需要通过约定好的接口。
:::
注意：通过Shadow DOM可以隔离DOM、CSS，但是Shadow DOM的JavaScript脚本是不会被隔离的，比如在Shadow DOM定义的JavaScript函数依然可以被外部访问，因为 JavaScript语言本身已经可以很好地实现组件化了。

### 浏览器如何实现Shadow DOM
Shadow DOM的作用：
* Shadow DOM中的元素对于整个网页是不可见的；
* Shadow DOM的CSS不会影响到整个网页的CSSOM，Shadow DOM内部的CSS只对内部的元素起作用。

每个Shadow DOM都有一个shadow root的根节点，所以**每个Shadow DOM都可以看成是一个独立的DOM**，有自己的样式、自己的属性，内部样式不会影响到外部样式，外部样式也不会影响到内部样式。<br/>
浏览器为了实现影子DOM的特性，在代码内部做了条件判断，当通过DOM接口去查找元素时，渲染引擎会去判断该标签属性下的shadow-root元素是否为Shadow DOM，如果是Shadow DOM，那么直接跳过shadow-root元素的查询操作，这样通过DOM API就无法直接查询到Shadow DOM的内部元素了。当生成布局树的时候，渲染引擎也会判断当前标签属性下面的shadow-root元素是否是Shadow DOM，如果是那么在Shadow DOM内部元素的节点选择CSS样式的时候，会直接使用Shadow DOM内部的CSS属性。最终渲染的效果就是Shadow DOM内部定义的样式。

![Shadow Dom](https://s2.loli.net/2022/10/13/mr6RYBCi9JNhAvg.jpg)

## 总结
* 组件化：高内聚、低耦合。
* DOM、CSSOM是全局的，阻碍了前端组件化。
* Web Components方案 => Custom elements + Shadow DOM + HTML template。
* Web Components实现了DOM、CSS的隔离。