---
title: CSRF攻击
categories:
 - Browser
tags:
 - CSRF
 - 跨站请求伪造
date: 2023-01-03
sidebar: 'auto'
---

## 前言
CSRF（Cross-site request forgery/跨站请求伪造）：
1. 引诱用户打开黑客的网站。
2. 在黑客的网站中利用用户的登录状态发起的跨站请求。

## CSRF攻击
跟XSS不同的是，CSRF攻击不需要将恶意代码注入用户的页面，利用的是服务器漏洞和用户的登录状态来实施攻击。当用户打开了黑客的页面后，常见的有三种方式实施CSRF攻击。

### 自动发起Get请求
```html
<!DOCTYPE html>
<html>
   <body>
      <h1>🎣网站</h1>
      <img src="https://mobs.fun/sendBTC?user=hacker&count=1000">
   </body>
</html>
```
这就是钓鱼网站的HTML，将转账接口隐藏在img标签中，浏览器认为这是图片资源，当页面加载，浏览器自动发起img资源请求，如果服务器没有对请求做处理判断，服务器认为这是一个正常的转账请求，财产就被转移了。

### 自动发起POST请求
```html
<!DOCTYPE html>
<html>
   <body>
      <h1>🎣网站</h1>
      <form id="hacker-form" action="https://mobs.fun/sendBTC" method="POST">
        <input type="hidden" name="user" value="hacker" />
        <input type="hidden" name="number" value="1000" />
      </form>
      <script>document.getElementById("hacker-form").submit();</script>
   </body>
</html>
```
有些服务器接口使用的POST方法的，所以黑客需要在钓鱼网站上伪造POST请求，当用户打开黑客的站点时自动提交POST请求。在钓鱼页面中构建了一个隐藏的表单，表单的内容就是转账接口，当用户打开站点后，该表单会被自动执行提交，这就自动实现跨站点POST数据提交。

### 引诱用户点击链接
诱惑用户点击黑客站点上的链接，这种方式通常出现在论坛或者恶意邮件上。当用户登录了自己网站，点击该链接就会发送该伪造请求。
```html
<div>
  <img src="https://mobs.fun/you-know-what"/>
  <a href="https://mobs.fun/sendBTC?user=hacker&count=1000" traget="_blank">点击在线观看</a>
</div>
```

## 阻止CSRF攻击