---
title: HTTP缓存策略
categories:
 - Network
tags:
 - 缓存控制
 - 强缓存
 - 缓存校验
 - 协商缓存
date: 2022-10-31
sidebar: 'auto'
---

## 前言
浏览器二次打开会很快，一部分原因得益于借助HTTP头实现的缓存策略。
* [很多站点二次打开速度很快？](./browser-http.html#为什么很多站点第二次打开速度很快)
* [MDN - HTTP缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)
:::tip
~~强缓存~~、~~协商缓存~~这两个词我第一次看到不太能理解是做啥的，强（弱）缓存？协商？跟浏览器协商？<br/>
* ~~强缓存~~ => 缓存控制：缓存没过期，浏览器直接读取缓存。
* ~~协商缓存~~ => 缓存校验机制：Etag + Last-Modified校验缓存是否可用，可用浏览器直接读取缓存，否则使用服务端返回的新资源。
:::

## 缓存控制
浏览器基于HTTP头中**cache-control、expires**字段判断是否命中资源缓存，命中直接从缓存读取资源不发送请求到服务端<br/>
![缓存控制-强缓存.png](https://s2.loli.net/2022/10/31/lkPeigBYGyOTm6Q.png)
### Expires
HTTP/1.0用于标识资源过期时间的header，是绝对时间（服务端返回）。<br/>
缺陷：**受限于本地时间，如果修改了本地时间，会造成缓存失效**
```http
Expires: Wed, 11 May 2333 02:33:00 GMT
```
### Cache-Control
HTTP/1.1提出Cache-Control解决Expires的缺陷，是相对时间（相对于HTTP发送请求的时间--Date），**优先级高于Expires**。
```http
Cache-Control: max-age=23330000
```
一些属性值：
* Cache-Control: no-cache => 本地依旧会缓存数据，但是请求不会用，直接发给服务端处理 (协商缓存验证)，每次请求都重新验证缓存新鲜度。
* Cache-Control: no-store => 不缓存数据到本地，不使用任何缓存。
* Cache-Control: public => 可以被所有用户缓存（终端、CDN、中间代理服务器）。
* Cache-Control: private => 只能被客户端浏览器缓存（私有缓存），不允许中继缓存服务器缓存。

## 缓存校验
* 服务端缓存策略，服务端判断是否可以缓存。
* 服务端判断客户端资源、服务端资源是否一致，一致返回304；否则返回200 + 最新资源。
* 利用Last-Modified + If-Modified-Since || ETag + If-None-Match 这两对Header进行管理。
### Last-Modified + If-Modified-Since
* 客户端首次发送请求 => 服务端返回资源 + 资源唯一标识Last-Modified => 客户端使用If-Modified-Since字段保存Last-Modified值。
* 再次发请求header带上If-Modified-Since => 服务端比对If-Modified-Since ?= Last-Modified => 相等返回304（资源未修改）、不等返回200 + 新的Last-Modified + 新资源。

Last-Modified缺陷：
* If-Modified-Since只能检查到秒为最小单位来计算时间差，对于资源更新速度小于秒的无法使用该缓存策略。
* 如果资源是服务端动态生成，那么Last-Modified的值永远都是生成时间，即使资源本身没发生变化，Last-Modified依旧会更新，缓存无法起作用。
* 编辑文件，但文件内容不改变，服务端无法感知文件是否真正改变，是通过最后编辑时间进行判断更新了Last-Modified，导致资源被请求当成新文件，引发了一次新的响应请求。

### ETag + If-None-Match
为了解决服务端无法正确感知文件的变化，HTTP/1.1出现ETag完善Last-Modified的缺陷。<br />
* 首次发送请求 => 服务端返回资源 + Etag => 客户端使用If-None-Match保存Etag值。
* 再次发送请求header带上If-None-Match => 服务端匹配If-None-Match ?= 最后一次修改的Etag => 相等返回304、不等返回200 + 新的Etag + 新资源。<br/>

Etag特点：
* **资源发生变化才会导致Etag变化，跟最后修改时间无关，确保资源的唯一性**。
* 避免了基于修改时间来判断，无法应对高频修改的文件（频率低于1s、某些服务器UNIX记录MTIME只能精确到秒）、只改变修改时间不动内容的情况。
* 优先级高于Last-Modified。

### 分布式系统注意
* 多台机器间文件的Last-Modified必须保持一致，以免负载均衡到不同机器导致比对失败
* 尽量关闭掉ETag(每台机器生成的ETag都会不一样）

![缓存校验.png](https://s2.loli.net/2022/10/31/6Pes2H4qQFkLvwW.png)

## 常见缓存状态码
* 200：Expires/Cache-Control标识缓存失效 => 返回新的资源文件。
* 200(from disk cache/from memory cache): Expires/Cache-Control两者都存在、未过期，Cache-Control优先Expires时，浏览器成功从本地获取资源。
* 304(Not Modified)：Last-modified/Etag未过期时，服务端返回状态码304。

## 总结
发送请求之前，浏览器校验：
* Cache-Control 
* Expires

请求发送之后，服务端校验：
* If-None-Match ?= Etag
* If-Modified-Since ?= Last-Modified
