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
发起CSRF攻击的三个必要条件：
1. 目标站点存在CSRF漏洞
2. 用户登录过目标站点，且在浏览器上保持对目标站点的登录状态
3. 用户打开第三方站点（有可能是黑客站点、论坛）
:::tip
相较于XSS，CSRF不会向页面注入恶意脚本，所以是无法通过CSRF攻击获取用户页面数据，关键点是找到服务器漏洞，所以主要的防护手段是提升服务器安全性。
:::

### Cookie -- SameSite
CSRF会利用用户登录状态来发起攻击，Cookie是浏览器、服务器之间维护登录状态的关键数据。CSRF攻击都是从第三方站点发起的，所以要能实现从第三方站点发送请求时禁止Cookie的发送。<br/>
* 从第三方站点发起的请求，需要浏览器禁止发送关键Cookie数据到服务器；
* 同一个站点发起的请求，需要保证Cookie数据正常发送。

在HTTP响应头set-cookie字段设置SameSite：
1. Strict => 浏览器会完全禁止第三方页面拿到Cookie发送到服务器。
2. Lax => 跨站下，从第三方站点的链接打开、从第三方站点提交Get方式的表单会携带Cookie。但在第三方站点中使用Post、img、iframe等标签加载的URL，都不会携带Cookie。
3. None => 任何情况下都会发送Cookie。

### 验证请求的来源站点
在服务器端验证请求来源的站点。CSRF攻击大多来自于第三方站点，服务器可以禁止来自第三方站点的请求。
判断方式基于HTTP请求头中的Referer和Origin属性：
* Referer => 记录了该HTTP请求的来源地址（有些场景是不适合将来源URL暴露给服务器的，因此浏览器提供给开发者一个选项，可以不用上传Referer值，可参考Referrer Policy）。
* Origin => 在服务器端验证请求头中的 Referer并不是太可靠，所以在一些重要的场合，通过XMLHttpRequest、Fecth、Post方法发送请求时，都会带上Origin属性。只包含了**域名信息**，没有包含具体的URL路径，这是Origin和Referer的一个主要区别。Origin的值之所以不包含详细路径信息，是有些站点因为安全考虑，不想把源站点的详细路径暴露给服务器。服务器的策略是优先判断Origin，如果没，再根据实际情况判断是否使用Referer值。

### CSRF Token
CSRF Token验证流程：
1. 在浏览器向服务器发起请求时，服务器生成一个CSRF Token。CSRF Token是服务器生成的字符串，然后将该字符串植入到返回的页面中。
2. 在浏览器端如果要发起转账的请求，那么需要带上页面中的CSRF Token，然后服务器会验证该Token是否合法。**如果是从第三方站点发出的请求，无法获取到CSRF Token，即使发出请求**，服务器也会因为CSRF Token不正确而拒绝请求。

## 总结
CSRF攻击三个条件：
1. 目标站点存在漏洞
2. 用户要登录过目标站点
3. 黑客需要通过第三方站点发起攻击

防止CSRF攻击：
1. Cookie SameSite属性
2. 验证请求的来源站点
3. CSRF Token

页面安全问题的主要原因就是**浏览器为同源策略开的两个后门**：
1. 页面中可以任意引用第三方资源
2. 通过CORS策略让XMLHttpRequest和Fetch去跨域请求资源

解决上述的方案引入的方案：
* 引入CSP限制页面任意引入外部资源
* 引入HttpOnly机制来禁止XMLHttpRequest或者Fetch发送一些关键Cookie（通过JS读取cookie）
* 引入SameSite、Origin防止CSRF攻击
