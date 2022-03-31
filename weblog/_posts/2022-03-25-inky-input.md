---
title: Inky 自定义玩家名字
permalink: /weblog/inky-input
tag: [Inky, JavaScript]
---


[Inky](https://www.inklestudios.com/ink/) 是一种适于编写游戏的脚本语言。以下内容关于如何绕过程序限制，允许玩家在游戏中使用自定义名称。

<!-- more -->

## 实用链接

- [官方简易教程](https://www.inklestudios.com/ink/web-tutorial/)
- [官方详细教程](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md)
- [民间汉化指南](https://www.yuque.com/inky)

## 具体操作

### `.ink` 文件

在文件开头开始定义玩家名称变量及默认名称，此处以 `player` 与 `Charname` 为例，并在后续代码中通过 `{player}` 使用此名称。

```
VAR player = "Charname"
```

### `index.html` 文件

``` html
<div class="header">
	<h1>game</h1>
	<h2 class="byline"></h2>
</div>
```

在以上代码后加入输入框：

``` html
<div class="input">
	<input type="text" placeholder="Name, please." />
	<input type="button" value="Go!" />
</div>
```

### `style.css` 文件

根据需要设定样式，可在最后加入如下示例代码：

``` css
.input {
	text-align: center;
	height: 1.5em;
	overflow: hidden;
	transition: .5s height ease-in-out;
}
.input.hidden {
	height: 0;
}
input:placeholder-shown + input {
	opacity: .5;
	pointer-events: none;
}
input[type="button"] {
	cursor: pointer;
}
```

### `main.js` 文件

如在 `.ink` 文件中 `player` 为第一个全局变量，在当前版本 `19` 下可直接套用如下方案：

将第一行 `(function(storyContent) {` 改为 `function game(storyContent) {`；

将最后一行 `})(storyContent);` 改为 `};`；

在最开始插入：

``` javascript
const input = document.querySelector(".input");
input.lastElementChild.addEventListener("click", () => {
	storyContent["root"][2]["global decl"][2] = `^${input.firstElementChild.value}`;
	input.classList.add("hidden");
	setTimeout(() => {game(storyContent)}, 500);
});
```
