---
title: 本地存储
categories:
 - JavaScript
tags:
 - cache
 - cookie
 - localStorage
 - sessionStorage
date: 2022-10-20
sidebar: 'auto'
---
## 前言
浏览器本地存储主要的四种方式：
* Cookie
* LocalStorage
* SessionStorage
* IndexedDB

## Cookie
Cookie（小型文本文件），一般是服务端发送到用户浏览器保存在本地的数据，浏览器下次发起请求会带上cookie发送给服务端，解决了HTTP无状态导致的问题。<br/>
常见的应用场景就是**保持用户登录状态**。需要注意，如果不使用**HTTPS对请求进行加密**，cookie信息容易泄露导致安全问题，利用你的cookie伪造你登录网站。<br/>
文件大小一般不超过4KB，由Name - Value和几个可选属性（有效期、安全性）组成。[MDN - HTTP Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)<br/>
常见属性：
```js
// Cookie过期时间 =>  过期时间的设置，只影响客户端行为，无关服务端。
Expires=Wed, 21 Oct 2015 07:28:00 GMT;
// Cookie经过多少秒失效 =>优先级高于Expires
Max-Age=23333
// 指定了哪些主机可以接受Cookie
Domain=mozilla.org
// 标识指定了主机下的哪些路径可以接受Cookie => 这个路径必须出现请求资源的路径上才会发送Cookie
Path=/docs
// 标记为Secure的Cookie只能被HTTPS协议加密过的请求发送给服务端
Secure
```
常用操作：
```js
document.cookie = 'Name=Value';
// 服务端设置Cookie
Set-Cookie:name=aa; domain=aa.net; path=/ # 
// 客户端设置Cookie
document.cookie = name=bb; domain=aa.net; path=/ # 
// Cookie删除一般就是设置过期时间，到期浏览器自动删除。
```

## LocalStorage
特性：
* 生命周期：**持久化的本地存储**，除非主动删除数据，否则永远不会过期。
* localStorage中的键值以字符串的形式存储 => 注意会把number自动转成string。
* localStorage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡。
* 同一域中存储的信息是共享的，受同源策略的限制。
* 大小：5M（跟浏览器厂商有关）。
```js
localStorage.setItem('username','mobs');
localStorage.getItem('username')
// 获取第一个键名
localStorage.key(0) 
localStorage.removeItem('username')
// 一次性清除所有存储
localStorage.clear()
```
缺陷：
* 无法像Cookie一样设置过期时间
* 只能存入字符串，无法直接存对象
```js
localStorage.setItem('key', {name: 'value'});
// '[object, Object]'
console.log(localStorage.getItem('key')); 
```

## SessionStorage
sessionStorage和localStorage使用方法基本一致，唯一不同的是生命周期，**一旦页面（会话）关闭，sessionStorage将会删除数据。**

## IndexedDB
一般用于客户端存储大量结构化数据(文件、blobs)，使用索引来实现对数据的高性能搜索。<br/>
Web Storage对于存储少量的数据很有用，但对于存储更大量的结构化数据就不太合适，所以提供了一个IndexedDB解决方案。[MDN - IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)<br/>
特性：
* 储存量理论上没有上限。
* 所有操作都是异步的，相比LocalStorage同步操作性能更高，尤其是数据量较大时。
* 原生支持储存JS的对象。
* 是个数据库。

## 应用场景
* 标记、跟踪用户行为，推荐使用cookie。
* 适合长期保存在本地的数据（令牌），推荐使用localStorage。
* 敏感账号一次性登录，推荐使用sessionStorage。
* 存储大量数据的情况、在线文档（富文本编辑器）保存编辑历史的情况，推荐使用indexedDB。

## 总结
cookie、sessionStorage、localStorage三者的区别：
* 存储大小：<br/>
  cookie数据大小不能超过4k；<br/>
  sessionStorage和localStorage虽然也有存储大小的限制，但比cookie大可以达到5M或更大；
* 有效时间：<br/>
  cookie设置的过期时间之前一直有效，即使浏览器关闭；<br/>
  localStorage存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；<br/>
  sessionStorage数据在浏览器关闭后自动删除；
* 数据与服务器之间的交互方式：<br/>
  cookie的数据会自动的传给服务器，服务器端也可以写cookie到客户端；<br/>
  sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存；