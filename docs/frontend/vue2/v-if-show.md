---
title: v-if/v-show
categories:
 - Vue2
tags:
 - v-if
 - v-show
date: 2022-10-29
sidebar: 'auto'
---

## 前言
vue中v-if、v-show指令 => 控制元素在页面上是否显示。
```js
<div v-if="true" />
<div v-show="false" />
```
## v-show
v-show不管初始条件值，元素总是会被编译渲染（初始化渲染消耗更高），实际是给元素添加CSS属性 => display: none实现元素的显示隐藏，所以是基于CSS的变化。
```js
export const vShow = {
  // 有transition就执行transition
  // 没有直接设置display属性
  beforeMount(el, { value }, { transition }) {
    if (transition && value) {
      transition.beforeEnter(el)
    } else {
      setDisplay(el, value)
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el)
    }
  },
  beforeUnmount(el) {
    setDisplay(el)
  }
}
function setDisplay(el){
  el.style.display = 'none'
}
```
## v-if
v-if显示隐藏有一个**局部编译/卸载**的过程，切换过程中会销毁和重建DOM的事件监听和内部子组件，只有在表达式为真的情况下，页面才会真正去渲染。<br/>
Vue页面解析概览：
1. template => ast结构的JS对象
2. JS对象（ast） => 编译出render、staticRenderFns函数
3. 执行render、staticRenderFns函数 => 生成虚拟DOM（VNode）:各个DOM节点所需的所有信息
4. patch函数借助虚拟DOM比对算法计算VNode => 根据补丁创建真实DOM
```js
export const transformIf = createStructuralDirectiveTransform(
  /^(if|else|else-if)$/,
  (node, dir, context) => {
    return processIf(node, dir, context, (ifNode, branch, isRoot) => {
      return () => {
        if (isRoot) {
          // render函数中基于表达式的值决定是否生成DOM。
          ifNode.codegenNode = createCodegenNodeForBranch(
            branch,
            key,
            context
          ) as IfConditionalExpression
        } 
      }
    })
  }
)
```
## 总结
* v-if、v-show控制dom元素的显示隐藏
* v-show初始化渲染性能消耗更多，元素都会去编译渲染
* 进行显示隐藏切换操作，v-if性能消耗更多 => 直接操作dom节点增加与删除
* 频繁切换显示隐藏 => v-show（CSS切换显示隐藏）
* 不频繁显示切换 => v-if（按需渲染）