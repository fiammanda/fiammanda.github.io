---
title: Valine 移除自带样式
tags: [JavaScript, jQuery]
permalink: /weblog/valine-remove-official-style
---

``` javascript
$('head style').eq(-1).remove();
```
