---
title: Notes for Jekyll
tags: [Jekyll]
excerpt: Jekyll 安装、建站问题记录。
permalink: /weblog/jekyll-notes
---

<!-- more -->

## Installation

以下步骤都在 PowerShell 中进行。

设置执行策略：

``` bash
set-executionpolicy remotesigned -s currentuser
```

设置 Scoop 安装路径：

``` bash
[environment]::setEnvironmentVariable('SCOOP','C:\your\path','User')
```

安装 Scoop：

``` bash
iwr -useb get.scoop.sh | iex
```

添加 Scoop 源：

``` bash
scoop bucket add extras
```

安装 Git：

``` bash
scoop install git
```

安装 Ruby：

``` bash
scoop install ruby
```

安装 MSYS2：

``` bash
scoop install msys2
msys2
```

重启命令行，安装 Windows 环境下工具链：

``` bash
ridk install 3
```

安装 Jekyll：

``` bash
gem install bundler jekyll
gem update
```

如报错，尝试重装 Ruby。

## Liquid

Liquid 语言 else if 竟然是 `elsif`，而且不能进行正则替换！

## Use

`folder/_posts` 中内容仍属于 `site.posts`，且 `category` 为 `folder`。

