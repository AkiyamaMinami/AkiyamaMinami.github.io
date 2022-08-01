---
title: JavaScript -- this李在赣神魔？
sidebar: 'auto'
date: 2022-08-01
categories:
 - FrontEnd
 - JavaScript
tags:
 - this
---

## 前言
> 记得在面向对象的语言中，this指向当前对象实例。<br />
但在JavaScript中，this关键字比较灵活（皮），不同的执行环境指向的值是不一样的，难受~

## this是什么？
要明确的一点 => **this**和**执行上下文**是绑定的，**执行上下文创建**的时候会确定this的指向。