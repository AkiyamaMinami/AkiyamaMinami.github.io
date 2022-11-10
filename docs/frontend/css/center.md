---
title: 垂直居中
categories:
 - Css
tags:
 - flex
date: 2022-11-06
sidebar: 'auto'
---

## 实现

### Flex
```scss
.father {
    display: flex;
    // 主轴居中
    justify-content: center;
    // 垂直轴居中 
    align-items: center;
    .son {}
}
```
### Grid
```scss
.father {
    display: grid;
    align-items: center;
    justify-content: center;
    .son {}
}
```
### 绝对定位 + transform
```scss
.father {
    position: relative;
    .son {
        position: absolute;
        top: -50%;
        left: -50%;
        // 位移自身宽度和高度的-50%
        transform: translate(-50%, -50%)
    }
}
```
### 绝对定位 + margin: -50px
```scss
.father {
    position: relative;
    .son {
        position: absolute;
        top: -50%;
        left: -50%;
        // 移动自身宽度的一半
        margin-left: -50px;
        margin-top: -50px;
        width: 100px;
        height: 100px;
    }
}
```
### 绝对定位 + margin: auto
```scss
.father {
    position: relative;
    .son {
        position: absolute;
        top: 0;
        left: 0; 
        right: 0;
        bottom: 0;
        margin: auto;
    }
}
```

## 总结
### 内联元素
水平居中：
* 行内元素 => text-align: center
* 父容器 => display: flex; justify-content: center
垂直居中：
* height === line-height
* display: table-cell; vertical-align: middle;

### 块级元素
水平居中：
* 定宽 => margin: 0 auto
* 绝对定位 + left: 50% + margin-left
垂直居中：
* 绝对定位 + top: 50% + margin-top
* flex
* grid