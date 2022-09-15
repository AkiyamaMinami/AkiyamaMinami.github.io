---
title: 剑指Offer -- 024.反转链表
date: 2022-09-15
sidebar: 'auto'
categories:
 - LeetCode
tags:
 - 反转链表
---

## 问
定义一个函数，输入一个链表的头节点，**反转该链表**并**输出反转后链表的头节点**。
```js
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```
## 答
### 双指针
2.next -> 1.next -> null。<br/>
每个节点的next指向前一个节点。<br/>
一个指针用于遍历，另一个指针用于指向前一个节点。
```js
let reverseLinkList = function (head) {
    // 当前节点
    let cur = head
    // 前一个节点 null
    let pre = null
    while(cur) {
        let tmp = cur.next
        cur.next = pre
        pre = cur
        cur = tmp
    }
    return pre
}
```

## Try
[反转链表](https://leetcode.cn/problems/fan-zhuan-lian-biao-lcof/)
