---
title: 渲染阶段HTML、CSS、JavaScript是如何构建页面的？
categories:
 - Browser
# tags:
#  - DOM生成
#  - 样式计算
#  - 布局
date: 2022-08-28
sidebar: 'auto'
---

## 前言
浏览器在提交文档数据后（导航流程），开始进行页面渲染。<br/>
我们在开发HTML、CSS、JavaScript完成后，浏览器打开就可以展示页面。
* HTML(Hyper Text Markup Language)
  标签（标记） + 文本 => HTML文件内容。<br/>
  每个标签都有自己的语义，浏览器根据标签的语义正确的展示文本内容。
* CSS(Cascading Style Sheets)
  选择器 + 属性 => CSS<br/>
  改变HTML内容的字体大小、颜色more...，需要CSS来实现，通过选择器定位到HTML标签内容，渲染引擎根据属性正确显示HTML内容。
* JavaScript
  让网页更加动态，能够操作HTML和CSS

渲染进程执行的过程中会被拆分为很多个子阶段，输入HTML文件经过很多个子阶段到最后渲染，
这样的处理过程可以称为**渲染流水线**。
我们需要关注的点：
* 子阶段开始前输入的内容
* 子阶段处理的过程
* 子阶段结束后生成的内容

### DOM树构建
为何需要构建DOM树？<br/>
## 总结