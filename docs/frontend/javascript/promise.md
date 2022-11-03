---
title: Promise
categories:
 - JavaScript
tags:
 - Promise
date: 2022-09-06
sidebar: 'auto'
---
## 前言
::: tip
Promise解决的是异步编码风格的问题。
:::
### 异步编码的问题：代码逻辑不连续
JavaScript的异步编程模型：
* 页面执行机制 => **事件循环**
* 页面中任务**执行在主线程中**
* 耗时任务（下载网络资源、获取设备信息more...）会被放到其他线程or进程中去执行，**避免霸占主线程**
* 耗时任务处理完毕，**添加到渲染进程的消息队列**，等待循环系统处理
* 任务排队完毕，循环系统取出任务开始处理，**触发回调**
![异步编程模型](https://s2.loli.net/2022/09/06/zdpEkaDA8LxV2re.png)

**Web页面的单线程架构决定了异步回调**。异步回调影响了编码方式，举个🌰：
```js
// 下载的需求使用XMLHttpRequest来实现
// 执行状态
function onResolve(response){
  console.log(response) 
}
function onReject(error){
  console.log(error) 
}
 
let xhr = new XMLHttpRequest()
xhr.ontimeout = function(e) { 
  onReject(e)
}
xhr.onerror = function(e) { 
  onReject(e) 
}
xhr.onreadystatechange = function () { 
  onResolve(xhr.response) 
}
 
// 设置请求类型、请求 URL、是否同步信息
let URL = 'https://mobs.fun'
xhr.open('Get', URL, true);
 
// 设置xhr请求的超时时间
xhr.timeout = 3000 
// 设置响应返回的数据格式
xhr.responseType = "text" 
xhr.setRequestHeader("X_TEST","mobs.fun")
 
// 发出请求
xhr.send();
```
上面这段代码，出现了很多次回调，这么多的回调会导致代码的逻辑不连贯、不线性、不人性，这就是异步回调的影响。对此可以封装这堆凌乱的代码，**降低处理异步回调的次数**。
### 封装异步代码，处理流程变得线性
我们重点关注的是**输入内容（请求信息）和输出内容（回复信息）**，至于中间的异步请求过程，不想在代码中体现太多，因为这会干扰核心的代码逻辑。所以我们可以把XMLHttpRequest请求过程的代码封装起来，重点关注输入数据和输出结果。
1. 把输入的HTTP请求信息全部保存到一个request的结构中（请求地址、请求头、请求方式、引用地址、同步请求or异步请求、安全设置more...）
```js
// 构造request对象
function makeRequest(request_url) {
    let request = {
        method: 'Get',
        url: request_url,
        headers: '',
        body: '',
        credentials: false,
        sync: true,
        responseType: 'text',
        referrer: ''
    }
    return request
}
```
2. 封装请求过程了，把请求细节封装到XFetch函数
```js
//[in] request => 请求信息，请求头，延时值，返回类型等
//[out] resolve => 成功回调函数
//[out] reject => 失败回调函数
function XFetch(request, resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.ontimeout = function (e) { reject(e) }
    xhr.onerror = function (e) { reject(e) }
    xhr.onreadystatechange = function () {
        if (xhr.status = 200)
            resolve(xhr.response)
    }
    xhr.open(request.method, URL, request.sync);
    xhr.timeout = request.timeout;
    xhr.responseType = request.responseType;
    //...
    xhr.send();
}
```
3. 实现业务代码
```js
XFetch(
  makeRequest('https://mobs.fun'),
  function resolve(data) {
      console.log(data)
  }, 
  function reject(e) {
      console.log(e)
  }
)
```
### 回调地狱
上述的封装已经比较符合人性思维了，一些场景还是很好用的，但是一旦场景复杂，**会出现嵌套太多回调函数产生回调地狱**。
```js
XFetch(
  makeRequest('https://mobs.fun/1'),
  function resolve(response) {
      console.log(response)
      XFetch(
        makeRequest('https://mobs.fun/2'),
        function resolve(response) {
          console.log(response)
          XFetch(
            makeRequest('https://mobs.fun/3')
            function resolve(response) {
              console.log(response)
            }, 
            function reject(e) {
              console.log(e)
            }
          )
        }, 
        function reject(e) {
          console.log(e)
        }
      )
  },
  function reject(e) {
      console.log(e)
  }
)
```
这种多个请求之间的嵌套，看不懂很混乱。所以还需要解决这种嵌套调用后混乱的代码结构。<br/>
这段代码看上去很乱主要原因有两点：
* 嵌套调用：任务之间互相依赖，下个任务依赖上个任务的执行结果，并且在上个任务的回调函数中去执行新的业务逻辑，一旦嵌套层次多了之后，代码的可读性非常差。
* 任务的不确定性：执行每个任务都有两种可能（成功or失败），所以体现在代码中就需要对每个任务的执行结果做两次判断，这种对每个任务都要进行一次错误处理，明显增加了代码的混乱。

Promise帮助我们解决了这两个问题：
* 消灭嵌套调用。
* 合并多个任务的错误处理。

## Promise消灭嵌套调用和多次错误处理
使用Promise来重构XFetch的代码：
```js
function XFetch(request) {
  function executor(resolve, reject) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', request.url, true)
      xhr.ontimeout = function (e) { reject(e) }
      xhr.onerror = function (e) { reject(e) }
      xhr.onreadystatechange = function () {
          if (this.readyState === 4) {
              if (this.status === 200) {
                  resolve(this.responseText, this)
              } else {
                  let error = {
                      code: this.status,
                      response: this.response
                  }
                  reject(error, this)
              }
          }
      }
      xhr.send()
  }
  return new Promise(executor)
}
```
改造后进行调用：
```js
var x1 = XFetch(makeRequest('https://mobs.fun/1'))
var x2 = x1.then(value => {
    console.log(value)
    return XFetch(makeRequest('https://mobs.fun/2'))
})
var x3 = x2.then(value => {
    console.log(value)
    return XFetch(makeRequest('https://mobs.fun/3'))
})
x3.catch(error => {
    console.log(error)
})
```
Promise的使用方式：
* 引入Promise，调用XFetch时，返回一个Promise对象。
* 构造Promise对象时，需要传入一个executor函数，XFetch的主要业务流程都在executor函数中执行。
* excutor函数中的业务执行成功，调用resolve函数；执行失败，调用reject函数。
* excutor函数中调用resolve函数时，触发promise.then设置的回调函数；调用reject函数时，触发promise.catch设置的回调函数。
引入 Promise，代码看起来非常线性了，符合人的直觉。

### Promise如何消灭嵌套回调
产生嵌套函数的一个主要原因是在**发起任务请求时会带上回调函数**，这样当任务处理结束之后，下个任务就只能在回调函数中来处理了。<br/>
Promise主要通过两步解决嵌套回调问题:
1. Promise实现了回调函数的延时绑定，回调函数的延时绑定在代码上体现就是先创建Promise对象，通过Promise的构造函数executor来执行业务逻辑；创建好Promise对象之后，再使用promise.then来设置回调函数。
2. 将回调函数onResolve的返回值穿透到最外层，因为我们会根据onResolve函数的传入值来决定创建什么类型的Promise任务，创建好的Promise对象需要返回到最外层，这样就可以摆脱嵌套循环了。
```js
function executor(resolve, reject){
    resolve(100)
}
let p1 = new Promise(executor)
//p1延迟绑定回调函数onResolve
function onResolve(value){
    console.log(value)
    let res1 = new Promise((resolve, reject) => {
      resolve(1) 
    })
    return res1
}
// onResolve内部返回值透传到外部res1
let res1 = p1.then(onResolve)
res1.then((v) => {})
```
### Promise处理异常
有四个Promise对象：p0～p4。无论哪个对象里面抛出异常，都可以通过最后一个对象p4.catch来捕获异常，通过这种方式可以将所有Promise对象的错误合并到一个函数来处理，这样就解决了每个任务都需要单独处理异常的问题。之所以可以使用最后一个对象来捕获所有异常，是因为**Promise对象的错误具有冒泡性质**，会一直向后传递，直到被onReject函数处理或catch语句捕获为止。具备了这样冒泡的特性后，就不需要在每个Promise对象中单独捕获异常了。
```js
function executor(resolve, reject) {
    let rand = Math.random();
    console.log(1)
    console.log(rand)
    if (rand > 0.5)
        resolve()
    else
        reject()
}
var p0 = new Promise(executor);
 
var p1 = p0.then((value) => {
    console.log("succeed-1")
    return new Promise(executor)
})
 
var p3 = p1.then((value) => {
    console.log("succeed-2")
    return new Promise(executor)
})
 
var p4 = p3.then((value) => {
    console.log("succeed-3")
    return new Promise(executor)
})
 
p4.catch((error) => {
    console.log("error")
})
```

## Promise和微任务
```js
function executor(resolve, reject) {
    resolve(100)
}
let demo = new Promise(executor)
 
function onResolve(value){
    console.log(value)
}
demo.then(onResolve)
```
上述代码执行顺序：
1. 首先执行new Promise时，Promise的构造函数会被执行（Promise是V8引擎提供的，看不到Promise构造函数细节）。
2. 然后Promise的构造函数会调用Promise的参数executor函数。然后在executor中执行了resolve，
3. resolve函数也是在V8内部实现的，执行resolve函数，会触发demo.then设置的回调函数onResolve，所以resolve函数内部调用了通过demo.then设置的onResolve函数。
4. 由于Promise采用了回调函数延迟绑定技术，所以在执行resolve函数的时候，回调函数还没有绑定，那么只能推迟回调函数的执行。

## 实现Promise
采用了定时器来推迟onResolve的执行，**使用定时器的效率并不是太高**，好在我们有微任务，**所以Promise又把这个定时器改造成了微任务了**，这样既可以让onResolve_延时被调用，又提升了代码的执行效率。这就是Promise中使用微任务的原由了。
```js
function Bromise(executor) {
    var onResolve_ = null
    var onReject_ = null
     // 模拟实现resolve、then
    this.then = function (onResolve, onReject) {
        onResolve_ = onResolve
    };
    function resolve(value) {
      // Bromise是延迟绑定导致的，在调用到onResolve_函数的时候，Bromise.then还没有执行
      // 所以Bromise中的resolve方法，要让resolve延迟调用onResolve_
      // 可以在resolve函数里面加上一个定时器，让其延时执行onResolve_函数
      setTimeout(()=>{
        onResolve_(value)
      },0)
    }
    executor(resolve, null);
}
```

### Promise.all 
[MDN - Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
```js
// 入参 => Promise实例数组（可迭代对象）
// return => 新的Promise实例
const p = Promise.all([p1, p2, p3]);

// 入参Promise实例自定义catch
const p1 = Promise.resolve('p1');
const p2 = new Promise((resolve, reject) => {
  throw new Error('p2error');
}).catch(e => e);

Promise.all([p1, p2])
.then(r => 
  // log => ["p1", Error: p2error]
  console.log(r)
)
.catch(e => console.log(e));
```
实例p的状态：
1. p1、p2、p3**全部fulfilled** => p状态变成fulfilled，同时把p1、p2、p3的返回值组成数组传给p的fulfilled回调函数。
2. p1、p2、p3**任意一个rejected** => p状态变成rejected，同时把第一个被reject的实例的返回值，传给p的rejected回调函数。
3. 如果p1、p2、p3自定义了rejected回调函数catch => 如果发生rejected，不会触发all的的catch，rejected值也一起组成数组传给p的fulfilled回调函数。
## 总结
* Web页面是单线程架构模型，这种模型决定了编写代码的形式**异步编程**。
* 基于异步编程模型写出来的代码会把一些关键的逻辑点打乱，很不易读。
* 可以把一些不必要的回调接口封装起来。
* 稍微复杂点的场景依然存在着回调地狱（多层嵌套、每种任务的处理结果存在成功or失败）
* Promise通过**回调函数延迟绑定**、回调函数**返回值穿透**和**错误冒泡**解决该问题。
* Promise之所以要使用微任务是因为Promise回调函数延迟绑定技术导致的。