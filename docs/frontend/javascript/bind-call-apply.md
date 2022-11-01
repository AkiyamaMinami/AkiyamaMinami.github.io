---
title: bind/call/apply
sidebar: 'auto'
date: 2022-10-15
categories:
 - JavaScript
tags:
 - bind
 - call
 - apply
---

## 前言
call/apply/bind都是和this指向有关的，都是JavaScript内置对象Function的原型上的方法（Function.prototype.call()...）。
[this](./this.md)中提到call、apply、bind用于显示指定this的值。
## 作用
call/apply/bind作用是改变函数执行时的上下文，就是改变函数运行时的this指向。

### 为何需要改变this指向？
:::tip
提供复用性
:::
A对象有个方法，B对象如果也需要用到同样的方法，此时是单独为B对象扩展一个方法，还是直接借用A对象的方法呢？<br/>
显然直接借用A对象的方法更便捷，达到了目的、节省了内存。<br/>
call/apply/bind的核心理念：借用方法。借助已实现的方法，改变方法中数据的this指向，减少重复代码，节省内存。
### 场景：修正SetTimeout和SetInterval
```js
var name = "mobs";
var obj = {
    name: "233",
    say: function () {
      console.log(this.name);
    }
};
// 233 => this指向obj
obj.say();
// mobs => this指向window
setTimeout(obj.say, 0);
// 233 => this指向obj
setTimeout(obj.say.bind(obj), 100);
```
## 使用
### apply
```js
function fn(...args){
    console.log(this, args);
}
let obj = {
    myname:"mobs"
}
// 第一个参数this的指向、第二个参数是函数接受的参数（必须是数组）。
// 改变this指向后函数会立即执行。
fn.apply(obj, [1,2]);
// 这里的this指向window
fn(1,2)
```
如果第一个参数为null、undefined的时候，默认指向window(在浏览器中)。
### call
```js
function fn(...args){
    console.log(this, args);
}
let obj = {
    myname:"mobs"
}
// 第一个参数this的指向、第二个参数及以后都是函数接受的参数。
// 改变this指向后函数会立即执行。
fn.call(obj, 1, 2);
// 这里的this指向window
fn(1,2)
```
如果第一个参数为null、undefined的时候，默认指向window(在浏览器中)。
### bind
bind方法和call很相似，第一参数也是this的指向，后面传入的也是一个参数列表(但是参数可以分多次传入)，改变this指向后不会立即执行，而是返回一个永久改变this指向的函数。
```js
function fn(...args){
    console.log(this, args);
}
let obj = {
    myname:"mobs"
}
// this会变成传入的obj，bind不会立即执行函数。
const bindFn = fn.bind(obj, 3);
// this指向obj
bindFn(1, 2) 
// this指向window
fn(1, 2) 
```
## 区分
call与apply的唯一区别：
* apply是第2个参数，这个参数是一个类数组对象：传给函数的参数都写在数组中。
* call从第2~n的参数都是传给函数的。
:::tip
双a记忆法：apply是以a开头，传给函数的参数是类Array对象（类数组对象），也是以a开头的。
:::

call/apply和bind的区别：
* 执行：call/apply**改变了函数的this的指向并马上执行该函数**；
  bind则是返回改变了this指向后的函数，**不执行该函数**。
* 返回值：call/apply返回函数的执行结果；
 bind返回func的拷贝，并指定了func的this指向，保存了func的参数。

## 实现

### myBind
* 修改this指向
* 动态传递参数
```js
// 只在bind中传参数
fn.bind(obj,1,2)()
// 在bind中传递函数参数，同时也在返回的函数中传参数
fn.bind(obj,1)(2)
```
* 兼容new关键字 => bind返回的函数作为构造函数的时候，bind时指定的this值会失效，但传入的参数依然生效
```js
Function.prototype.myBind = function (context) {
    // 判断调用的对象是否为函数
    if (typeof this !== "function") {
        throw new TypeError("Error");
    }
    // 保存当前调用myBind的函数
    var oFn = this;
    // 获取第二个及之后的参数
    var args = Array.prototype.slice.call(arguments, 1);

    return function Fn() {
        return oFn.apply(
          this instanceof Fn 
          // bind返回的新函数作为构造函数调用，原先指定的this失效
          ? new oFn(...arguments)  
          // 指定的this绑定对象、保证多次传入参数
          : context , 
          args.concat(...arguments)
        ); 
    }
}
```

## 总结
* 三者都是改变函数的this对象指向。
* 三者传入的第一个参数都是this要指向的对象，如果没有这个参数或参数为undefined或null，则this默认指向全局window。
* 三者都可以传参，但是apply是数组，而call是参数列表。
* apply和call是一次性传入参数，而bind可以多次传入参数。
* apply、call是立即执行函数，bind是返回改变this之后的函数。