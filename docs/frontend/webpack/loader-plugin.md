---
title: Loader/Plugin
categories:
 - webpack
tags:
 - loader
 - plugin
date: 2022-10-27
sidebar: 'auto'
---

## 前言
* Loader：文件加载器，负责对**各种类型文件**进行处理、编译、压缩，赋予webpack（本身只能打包JS）打包非JS类型文件的功能。
* Plugin：赋予webpack更多灵活的功能，打包优化、文件管理、环境变量注入。
![webpack生命周期.png](https://s2.loli.net/2022/10/27/UHBzDqdyGZxFc2k.png)

## Loader
Webpack内部把所有文件都当作模块，分析各个模块之间依赖关系产生资源表，最终打包生成指定的文件。遇到import、require加载模块的时候，webpack只支持对JS、JSON文件打包，如果遇到css、sass、png等不同类型的文件，此时就需要配置Loader进行文件编译生成JS文件，确保Webpack能够成功解析并打包。<br/>
Loader负责：
1. 对模块的源码进行转换。
2. 在import、加载模块时进行预处理文件。

### 配置Loader
Webpack遇到不识别的模块，会在配置中查找当前模块文件的解析规则。
1. 推荐：在webpack.config.js文件中指定loader。
2. 内联在每个import语句中显式指定loader。
3. CLI在shell命令中指定loader。
```js
module.exports = {
  module: {
    // 数组形式，配置多个loader
    rules: [
      // 一个loader对象 
      {
        // 文件匹配规则
        test: /\.css$/,
        // 匹配成功调用的loader
        use: [
          { 
            loader: 'style-loader' 
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { 
            loader: 'sass-loader' 
          }
        ]
      }
    ]
  }
}
```
### 特性
1. Loader支持**链式调用**：
   每个Loader会处理之前已经处理过的资源最终变成JS代码，所以是**相反的顺序执行**，上述对css执行方式是sass-loader => css-loader => style-loader。
2. Loader可以是同步、异步。
3. Loader运行在Node.js中。
4. Loader能够产生额外的任意文件。
5. 常见的通过package.json的main来将一个npm模块导出为 oader，还可以在module.rules中使用loader字段直接引用一个模块。<br/>
通过Loader预处理函数，为JS生态系统提供更多能力 => 压缩、打包、语言翻...more

## Plugin
Plugin可以**运行在Webpack的不同阶段（钩子/生命周期）**，贯穿了webpack整个编译周期。
### 配置Plugin
```js
// npm安装
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
// 访问内置插件
const webpack = require('webpack'); 
module.exports = {
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ]
};
```
### 特性
本质是一个具有apply方法JS对象。apply方法会被Webpack Compiler调用，在整个编译生命周期都可以访问Compiler对象。<br/>
整个编译生命周期钩子：
* entry-option => 初始化option
* run => 启动
* compile => 开始编译
* compilation => 生成compilation对象
* make => 从entry开始递归分析依赖，准备对每个模块进行build
* after-compile => 编译build过程结束
* emit => 在将内存中assets内容写到磁盘文件夹之前
* after-emit => 在将内存中assets内容写到磁盘文件夹之后
* done => 编译完成
* failed => 编译失败
## 总结
Loader、Plugin运行时机上的区别：
* Loader运行在打包文件之前 => 实质是一个转换器，将A文件进行编译形成B文件，操作的是文件，比如A.scss、A.less convert => B.css。
* Plugin在整个编译周期都起作用 => 在Webpack运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过Webpack提供的API改变输出结果
