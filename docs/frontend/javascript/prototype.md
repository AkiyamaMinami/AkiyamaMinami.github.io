---
title: JavaScript -- 原型、原型链那些事儿~
sidebar: 'auto'
date: 2022-07-27
categories:
 - JavaScript
tags:
 - Prototype
---

## 前言
原型是JavaScript特性之一，JavaScript实现复用性（继承）利用的就是原型、原型链。<br />
ES6提供的class关键字让我们可以仿照Java实现一个“类”，使用extends实现类的继承
，其本质仍然是原型、原型链。

## 原型、原型链

### 核心点
* 原型**是一个对象，里面包含一些公共属性、方法**。
* 对象（实例）都有一个隐式（私有）属性__proto__，指向其构造函数的prototype属性。
* 函数（函数也是对象）都有一个属性prototype，该属性指向的就是原型。
* 原型里面有一个属性constructor指向其（构造）函数本身。
* 对象的__proto__（原型）有自己的__proto__，一直向上到一个内置对象（由顶级Object构造函数创建），其__proto__（原型）为null。
* 原型本身也会有自己的原型，这种**由原型之间一层层链接起来的数据结构称为原型链**。因为null不是原型，所以原型链的顶端是null。
* 函数的__proto__（原型）是一个匿名函数（function anonymous），匿名函数的__proto__指向内置对象。

### 图例参考
![原型链流程图.png](https://s2.loli.net/2022/07/31/G6nThJlWt1DUcCV.png)

### 一些思考
* 为什么只有函数才有prototype，被认为是特殊的对象？<br/>
因为函数能够创造对象实例，创造出来的对象实例统一通过__proto__能够访问原型，这就实现了多个对象继承。
* 为什么存在原型链？<br/>
基于原型自身是一个普通对象，是被Object函数构造的，所以原型对象本身也有__proto__属性，也就有了能够访问到Object实例对象的原型。
JavaScript中万物皆对象，Object是最顶层的函数，所以其原型也是最顶层的了，所以设定了最顶层这个原型对象的原型是null，也就没有办法继续根据原型去查找某些属性了。
* 所以原型具象的代称是什么呢？<br/>
**__proto__可以代称为原型**。万物皆对象，所有对象都是被构造出来的，所以他们都有自己的原型（构造者的基因），都是通过__proto__进行访问。
* 目的是什么呢？<br/>
这种特性，实现了继承，方便了复用。

### __proto__注意点
一般不推荐使用__proto__，推荐使用Object.getPrototypeOf/Object.setPrototypeOf。<br />
__proto__属性已在ECMAScript 6语言规范中标准化。<br />
**设置对象的原型是一个缓慢的操作，若对性能有要求，避免设置对象的原型**。
Object.setPrototypeOf这种设置对象原型性能差，我们尽量还是使用**Object.create**为对象设置原型。
```js
// obj的原型是Object.prototype
var obj={
    methodA(){
        console.log("hello");
    }
}
// 以obj为原型创建一个新的对象
var newObj = Object.create(obj);
// methodA是原型对象obj上的方法。
// 即newObj继承了它的原型对象obj的属性和方法。
// log hello
newObj.methodA(); 
```

## 原型链查找机制
当我们去访问某个对象的属性或方法，若该对象没有该属性或方法，JavaScript引擎会遍历原型链上的的所有原型对象，以此去查找属性或方法，直至找到为止，若整个原型链遍历完毕仍为查找到，抛出错误。
> 类似**作用域链的变量**查找机制。

## ES6 class
类（class）有一个prototype属性，这就说明了class本质是构造函数的语法糖。
```js
class A {}
// log "function"
typeof A;
```

## 总结

### 面试Tip
* 原型是一个对象。
* 访问一个对象的属性，不仅仅访问该对象，JavaScript引擎还会查找该对象的原型，以及该对象原型的原型，依次层层向上，直至找到或到原型链顶端。
* 所有函数的原型 => 匿名函数原型
* 所有对象的根原型 => 内置Object对象原型