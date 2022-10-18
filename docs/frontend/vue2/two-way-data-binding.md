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
## 总结