---
title: CSS如何影响渲染流程的？
categories:
 - Browser
tags:
 - CSSOM
 - 白屏
date: 2022-09-29
sidebar: 'auto'
---

## 前言
渲染流水线中的CSS样式计算的子阶段是非常重要的，决定了页面最终展示的效果，影响到用户体验。

## 渲染流程 => HTML + CSS（外部引用）
![CSS渲染流程.png](https://s2.loli.net/2022/09/29/KnudzTtSg9f4cE8.png)
渲染进程（or 浏览器进程）发起数据请求，该请求会通知网络进程去处理，网络进程请求后接受返回的HTML数据，将其发送给渲染进程，渲染进程开始解析HTML文件字节流，构建DOM树。
:::tip
**请求HTML数据和构建DOM树之间会有一段空闲时间，这有可能成为页面渲染的瓶颈。**
:::
```html
<html>
  <head>
      <link href="test.css" rel="stylesheet">
  </head>
  <body>
      <div>test</div>
  </body>
</html>
```
```css
/* test.css */
div{ 
    background-color:black
}
```
渲染进程在接收到HTML文件字节流的时候，会先开启一个**预解析线程**，如果遇到JavaScript文件 or CSS文件，预解析线程会提前进行下载。上述代码中，预解析线程会解析出一个外部的test.css文件并发起下载。这里也会出现一个空闲时间，当DOM树构建结束、test.css文件尚未下载完成的这段时间里，渲染流水线会处于空闲状态，因为下一步阶段是合成布局树，是需要DOM + CSSOM的，所以需要等待CSS下载结束并解析成CSSOM的。

### 关于CSSOM
跟HTML一样，渲染引擎是无法直接理解CSS文件的，需要解析成CSSOM结构才能理解（类似于DOM）。CSSOM在DOM中就是document.styleSheets<br/>
[CSSOM](https://developer.mozilla.org/zh-CN/docs/Glossary/CSSOM)作用：
* 给JavaScript提供操作样式表的能力
* 为合成布局树提供基础的样式信息

DOM + CSSOM => 合成布局树，布局树会复制一份DOM结构，同时会过滤掉不需要显示的元素（display:none、head标签、script标签），然后渲染引擎会根据CSSOM为对应DOM选择样式信息（样式计算）、同时也会计算布局树中DOM元素几何位置（布局计算），**样式计算 + 布局计算最终完成布局树构建**，之后就可以进入绘制流程了。

## 渲染流程 => HTML + CSS + JavaScript

### CSS + 标签内部遇到JavaScript代码
解析DOM的时候，如果遇到JavaScript脚本，需要暂停DOM解析去执行JavaScript（JavaScript是可能修改当前状态的DOM），执行JavaScript脚本之前，如果页面包含外部CSS文件 or style标签内置CSS内容，渲染引擎需要先把这些内容转为CSSOM，因为JavaScript也是有修改CSSOM的能力的。<br/>
所以：
* 执行JavaScript之前需要依赖CSSOM
* CSS部分情况也会阻塞DOM生成
![CSS_JS渲染流程.png](https://s2.loli.net/2022/09/29/EZ5VNxYOg8DrLtJ.png)

### CSS + 外部引用JavaScript文件
上面提到渲染进程在接收到HTML的时候，会有预解析的过程，HTML解析器识别到CSS文件和JavaScript文件需要下载，会同时发起两个文件的下载（所以下载时间按照最久的文件来计算）。后续的渲染流程跟上述是一样的，无论CSS文件 or JavaScript文件谁先下载到达，都需要等待CSS文件下载完成且生成CSSOM，才能继续执行JavaScript脚本，最后再继续构建DOM，生成布局树，渲染页面。
![CSS_外部JS渲染流程.png](https://s2.loli.net/2022/09/29/RBN53gArMXI2pmJ.png)

## 页面白屏优化策略
渲染流程的快慢影响到首次页面展示速度，首次页面展示速度影响用户体验。<br/>
从发起URL请求 => 首次页面展示，视觉上经历三个阶段。
1. 发送请求到提交数据的阶段，此时页面是老的内容，需要等待提交文档阶段，页面内容才会被替换 => [浏览器URL导航](./what-happen-input-url.html)<br/>
    该阶段瓶颈主要因素是**网络 or 服务器处理**。
2. 提交文档后，渲染进程创建空白页面（解析白屏），等待CSS、JavaScript文件加载完成，生成CSSOM和DOM，合成布局树，首次渲染。<br/> 
3. 首次渲染完成，进入完整的页面生成阶段，页面一点点绘制出来。

### 第2阶段白屏优化
一般情况，这阶段瓶颈主要体现在下载CSS、JavaScript文件、执行JavaScript、合成布局树、绘制页面等一系列流水线阶段。
* 内联JavaScript、内联CSS避免这两种文件的下载，这样HTML文件可以直接开始渲染流程。
* 部分场景不适合内联，可以考虑减小文件体积 => Webpack等打包工具移除注释、压缩JS。
* 无需在解析HTML阶段使用的JavaScript**使用async或defer标记异步加载**。
* 比较大的CSS文件，基于媒体查询属性，将其拆分为多个不同用途的CSS文件，特定的场景 => 加载特定的CSS文件。

## 总结
* DOM + CSSOM => 合成布局树，JavaScript同时有能力修改DOM、CSSOM。
* 执行JavaScript会阻塞HTML解析DOM，JavaScript执行前会依赖CSSOM的存在。
* JavaScript和CSS给页面渲染带来了限制。
* 注意资源加载速度、不同文件之间依赖关系。