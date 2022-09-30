---
title: JavaScript如何影响DOM树构建？
categories:
 - Browser
tags:
 - 阻塞DOM解析
date: 2022-09-22
sidebar: 'auto'
---

## 前言
渲染流水线里第一个子阶段**构建DOM树**，后续的子阶段直接或间接都依赖DOM树结构。<br/>
构建流程：输入HTML文件 => HTML解析器解析 => 输出DOM树。

## DOM是什么？
网络进程传输给渲染进程的**HTML文件字节流**无法直接被渲染引擎理解，所以需要将其转换为渲染引擎能理解的内部结构，该结构就是DOM（Document-Object-Model/文档对象模型）。<br/>
[DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)提供了对HTML文档结构化的表述，在渲染引擎里，DOM有三个层面的作用：
* 从页面层看，DOM是生成页面的基础数据结构。
* 从JavaScript脚本层看，DOM提供给JavaScript操作的接口，通过这套接口，JavaScript能对DOM结构进行访问、改变文档结构、样式、内容，将Web页面和脚本（程序语言）连接起来。
* 从安全层看，DOM是一道安全防护线，DOM解析阶段就无法解析一些不安全的内容。

综上：**DOM是表述HTML的内部数据结构，将Web页面和JavaScript脚本连接起来，并能过滤一些不安全的内容。**

## DOM树如何生成？
渲染引擎内部，有一个HTML解析器（HTMLParser）模块，负责将HTML字节流转换为DOM结构。

### HTML解析器何时解析？
HTML解析器不是等整个文档加载完成之后再去解析，而是**网络进程加载了多少数据，HTML解析器便解析多少数据**。<br/>
网络进程接收到响应头之后，根据响应头中的**content-type**字段来判断文件的类型，如果值是”**text/html**”，浏览器就会判断这是HTML类型的文件，然后会**为该请求选择or创建一个渲染进程**。渲染进程准备好后，网络进程和渲染进程之间会建立一个共享数据的管道，网络进程接收到字节流数据就会把数据放到管道，渲染进程则从管道的另外一端不断地读取数据，并同时将读取的数据送给HTML解析器，渲染进程的HTML解析器动态接收字节流，并将其解析为DOM。
![HTML字节流转DOM](https://s2.loli.net/2022/09/22/sSRZjU2hBCl4v7a.png)

### 1.分词器将字节流转为Token => Token栈维护
V8引擎编译JavaScript过程中的第一步就是做词法分析，将JavaScript分解为一个个Token。解析HTML也是如此，需要**通过分词器先将字节流转换为一个个Token**：
* Tag Token（StartTag or EndTag） => startTag-html、endTag-html
* 文本 Token => content
::: tip
渲染引擎有一个安全检查模块XSSAuditor，用于检测词法安全。在分词器解析出Token之后，会检测这些模块是否安全，比如是否引用了外部脚本，是否符合CSP规范，是否存在跨站点请求等。如果出现不符合规范的内容，XSSAuditor会拦截该脚本或下载任务进行。
:::

### 2.将Token解析为DOM节点 3.将DOM节点添加到DOM树中
这两步是同步进行的。HTML解析器维护了一个**Token栈**结构，Token栈主要用来**计算节点之间的父子关系**，在上一步中生成的Token，会按照顺序压到这个栈中。<br/>
* 入栈：如果入栈的是StartTag Token，HTML解析器会为该Token创建一个DOM节点，将其加入到DOM树中，其父节点就是栈中相邻的元素生成的节点。
* 出栈：如果分词器解析出来的是EndTag Token（EndTag div），HTML解析器会查看Token栈顶的元素是否是StarTag div，如果是，就将StartTag div从栈中弹出，表示该div元素解析完成。
* 如果分词器解析出是文本 Token，那么会生直接成一个文本节点，将其加入到DOM树中，**文本 Token是不需要压入到栈中的**，其父节点就是当前栈顶Token所对应的DOM节点。

通过分词器产生的新Token就这样不停地压栈和出栈，整个解析过程就这样一直持续下去，直到分词器将所有字节流分词完成。<br/>
上述思路可以联想到这道题：[有效的括号](../algorithm/leetcode/020.html)<br/>
在实际生产环境中，HTML源文件中可能包含CSS、JavaScript、图片、音频、视频等文件，所以处理过程比上述的还要复杂一点。

## JavaScript如何影响DOM生成？
```js
<html>
<body>
    <div>content</div>
    <script>
      let d1 = document.getElementsByTagName('div')[0]
      // 需要依赖DOM
      d1.innerText = 'js-content'
    </script>
    <div>test</div>
</body>
</html>
```
HTML解析器遇到script标签会暂停DOM的解析，因为JavaScript有可能修改当前已经生成的DOM结构。然后JavaScript引擎介入，执行script标签中的脚本，修改了DOM中第一个div的内容，脚本执行完毕，HTML解析器恢复执行解析过程，继续解析后续内容，直至生成最终DOM树。
### 暂停DOM解析，下载执行JavaScript代码
一般情况，我们引入的这段JavaScript代码需要先**下载**，下载的过程会阻塞DOM解析，而且下载一般都是很耗时的（网络环境、JavaScript文件大小）。<br/>
### 优化阻塞DOM解析的策略
1. Chrome浏览器的优化：**预解析操作。**当渲染引擎接收到字节流，会开启一个**预解析线程**，专门用于分析HTML文件中包含的JavaScript、CSS等相关的文件，一旦解析到这些文件，预解析线程会提前下载这些文件。
2. CDN加速JavaScript文件下载。
3. 压缩JavaScript文件体积。
4. 如果JavaScript文件中并没有操作DOM的代码，可以将其设置为**异步加载**。 **async、defer**进行标记。
   ```js
    // async标志的脚本文件一旦加载完成，会立即执行
    <script async type="text/javascript" src='test.js'></script>
    // defer标记的脚本文件，需要在DOMContentLoaded事件之前执行。
    <script defer type="text/javascript" src='test.js'></script>
   ```
## CSS同样也阻塞了HTML解析过程
```js
// 是依赖CSSOM的
div.style.color = 'red'
```
这是用于操纵CSSOM的，所以在执行JavaScript之前，需要解析**JavaScript语句中所有的CSS样式**。如果代码中引用了外部CSS文件，那么在执行JavaScript之前，**还需等待外部CSS文件下载完成并且解析生成CSSOM对象之后，才能执行JavaScript脚本**。<br/>
JavaScript引擎在解析JavaScript之前，无法知道JavaScript是否操作了CSSOM，所以渲染引擎在遇到JavaScript脚本之前，不管脚本是否操作了CSSOM，都会执行CSS文件下载、解析的操作，再执行JavaScript脚本。<br/>
所以：**JavaScript脚本是依赖样式表的。** => 这又是一个阻塞过程
## 总结
* HTML字节流 => 分词器生成Token（栈维护） => Token解析为DOM节点 => DOM节点添加到DOM树
* JavaScript阻塞DOM生成，CSS样式文件又阻塞JavaScript的执行。（需要关注JavaScript文件和样式表文件，影响页面性能）