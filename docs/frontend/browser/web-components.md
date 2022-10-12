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
## 总结