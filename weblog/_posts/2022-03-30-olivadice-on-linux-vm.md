---
title: OlivaDice 免费部署指北
permalink: /weblog/olivadice-on-linux-vm
tag: [OlivaDice]
---


[OlivaDice](https://wiki.dice.center/) 是一款可用于 QQ、Telegram、Fanbook、Dodo 及开黑啦的跑团掷骰机器人程序。本文适用读者：

- 计算机技能 10% 以上
- 持有 VISA/Master 信用卡
- 不管怎么说想先蹭一年免费服务器搭骰子的 Windows 用户
- 一年后的我

<!-- more -->

## 注册账号

首先，我们需要蹭到一个虚拟机。对于目前各类骰子程序来说，Windows 虚拟机是最方便的，但现在蹭不到了（需要正版激活码），不然我也不会写这个东西……

微软、谷歌、亚马逊应该都可以白嫖一年，据说谷歌还可以通过某种方式永续。以前有很多教程讲解怎么折腾，现在全都搜不到了，理性怀疑猫厂鹅厂联手干的……

目前我是搭在了 [Azure](https://portal.azure.com/) 上，注册申请需要 VISA/Master 信用卡，不会收费。

进入面板后选择 Linux Virtual Machines，在 Basics 标签页改动如下信息（剩下维持默认即可）：

- Virtual machine name: （自行填写）
- Region: （自行选择，部分选项不可使用）
- Image: Ubuntu Server 20.04 LTS
- Size: （最小的也够用）
- Authentication type: SSH public key
- Username: （自行填写 ❶）
- Key pair name: （自行填写）

所有需要自行填写的部分都请为了自己方便尽量短并记下来。填完这页直接选择 Review + create 标签页进行创建，此过程中可以下载一个 `.pem` 证书文件。

虚拟机创建完成后，在 Overview 页面找到 Public IP address，记录下来 ❷。

## 准备软件

- PuTTY
- WinSCP
- 一个正经的文本编辑器，包括而不限于 Atom、Notepad++、Sublime Text（我用的是这个）、Visual Studio Code等

前两者都可在[此](https://winscp.net/eng/downloads.php)获得，根据需要下载安装版或便携版。

### PuTTYgen

- 打开 PuTTYgen（随 PuTTY 一起获得）
- 点击 Load
- 选择 All Files (\*.\*) 文件类型
- 进入 `.pem` 文件目录并选择此文件
- 点击 Save private key
- 获得 `.ppk` 密钥文件 ❸
- 关闭 PuTTYgen

### PuTTY

- 打开 PuTTY
- 选择 Session （即默认打开）标签，在 Host Name (or IP address) 处填入 ❷
- 选择 Window > Appearance 标签，可以自行调大字体（可选）
- 选择 Connection > Data 标签，在 Auto-login username 处填入 ❶
- 选择 Connection > SSH > Auth 标签，在 Private key file for authentication 处选择 ❸
- 回到 Session 标签，依次点击 Save 和 Open

（注：此处和下文数字圈圈的意思是使用之前对应编号填写/生成的内容，如 ❶ 表示之前填写的 username。）

然后就会弹出一个黑色框框（命令行），显示如下内容：

```bash
login as: <username>
Authenticating with public key "<openssh-key>"
Welcome to Ubuntu 20.04.4 LTS (GNU/Linux 5.13.0-1017-azure x86_64)
```

这样即是顺利连上了之前创建的虚拟机。

## 安装程序

从本节起基本照搬贰狐老师的[教程](https://www.aobacore.com/archives/OlivOS-OlivaDice-Go-cqhttp.html)，结合了一些我自己的踩坑小技巧。

在 PuTTY 中每次一行输入如下命令：

- 临时提权

```bash
sudo su
```

- 安装环境（如不需要发送语音功能则可删去 `ffmpeg`）

```bash
apt update
apt install -y ffmpeg git python3 python3-pip screen
```

- 安装 OlivOS

```bash
cd /home && git clone https://github.com/OlivOS-Team/OlivOS.git
cd OlivOS && pip install -r requirements.txt
```

- 安装 OlivaDice

```bash
cd /home/OlivOS/plugin/app
wget https://ghproxy.com/https://github.com/OlivOS-Team/OlivaDiceCore/releases/latest/download/OlivaDiceCore.opk -N
wget https://ghproxy.com/https://github.com/OlivOS-Team/OlivaDiceJoy/releases/latest/download/OlivaDiceJoy.opk -N
wget https://ghproxy.com/https://github.com/OlivOS-Team/OlivaDiceLogger/releases/latest/download/OlivaDiceLogger.opk -N
wget https://ghproxy.com/https://github.com/OlivOS-Team/OlivaDiceMaster/releases/latest/download/OlivaDiceMaster.opk -N
```

- 安装 go-cqhttp

```bash
cd /home/OlivOS/
mkdir -p lib && chmod +x lib && cd lib
wget --no-check-certificate -O "go-cqhttp.tar.gz" https://github.com/Mrs4s/go-cqhttp/releases/latest/download/go-cqhttp_linux_amd64.tar.gz
tar zxf "go-cqhttp.tar.gz"
```

贰狐老师在此时说：

> 先运行一次OlivOS，然后按 `Ctrl+D` 停止运行程序，即可获得初始配置文件 `account.json`{: style="word-break: normal"}，参照如下注释修改。

实测多次发现：

1. `Ctrl+D` 停止不了，只能两次 `Ctrl+C`
2. `account.json` 还是空的
3. 21 世纪了我们不要用命令行改文件了吧眼睛和脑子都受不住

因此我们这么干：

- 运行 go-cqhttp 后关闭

```	
cd /home/OlivOS/lib && ./go-cqhttp
```

- 修改 OlivOS 文件夹及内容的所有者，以便在下一步使用图形界面软件

```bash
cd /home && chown -R ❶ OlivOS
```

## 配置程序

现在把 PuTTY 丢一边（别关）并掏出 WinSCP：

- File protocol: SFTP
- Host name: ❷
- User name: ❶
- 点击 Advanced，选择 SSH > Authenrication 标签，在 Private key file 处选择 ❸
- 点击 OK 和 Login

这样即是顺利连上了之前创建的虚拟机，拥有了图形界面，并且还能在 PC 上修改文件。

- 打开 `/home/OlivOS/conf/basic.json`，在约 100 行找到 `OlivOS_flask_post_rx` 一段，记下 `port` 值 ❹（当前版本默认为 `55001`）

```json
"OlivOS_flask_post_rx" : {
	"enable" : true,
	"name" : "OlivOS_flask_post_rx",
	"type" : "post",
	"interval" : 0.002,
	"dead_interval" : 1,
	"tx_queue" : "OlivOS_rx_queue",
	"logger_proc" : "OlivOS_logger",
	"debug" : false,
	"server" : {
		"auto" : true,
		"host" : "0.0.0.0",
		"port" : 55001 //←看这里！
	}
},
```

- 打开 `/home/OlivOS/conf/account.json`，将以下内容复制进去，按注释修改并记下标号处

```json
{
	"account": [
		{
			"id": 123456789, //改为机器人 QQ
			"password": "", //留空
			"sdk_type": "onebot",
			"platform_type": "qq",
			"model_type": "gocqhttp_show",
			"server": {
				"auto": false,
				"type": "post",
				"host": "http://127.0.0.1",
				"port": 57000, //乱写也行 ❺
				"access_token": "" //输入自定密码 ❻
			},
			"debug": false
		}
	]
}
```

- 打开 `/home/OlivOS/lib/config.yml`，查看/修改如下内容：

  - 第 4 行 `uin`，改为机器人 QQ

```yaml
account:              # 账号相关
  uin: 123456789      # QQ账号 ←改这里
```

  - 第 62 行左右 `access-token`，必须与 `account.json` 中的 `access-token` 保持一致

```yaml
# 默认中间件锚点
default-middlewares: &default
  # 访问密钥, 强烈推荐在公网的服务器设置
  access-token: '❻'  # ←改这里
```

  - 第 97 行左右 `port`，必须与 `account.json` 中的 `port` 保持一致（当前版本默认为 `57000`）；下一行 `timeout` 值改为 `60`

```yaml
  - http: # HTTP 通信设置
      host: 127.0.0.1 # 服务端监听地址
      port: 57000     # 服务端监听端口 ←看这里 ❺
      timeout: 60     # 反向 HTTP 超时时间, 单位秒，<5 时将被忽略 ←改这里
```

  - 第 105 行左右，建议直接复制粘贴，必须保证缩进正确，端口 `55001` 与 `basic.json` 中的 `port` 保持一致

```yaml
      post:           # 反向 HTTP POST 地址列表
        - url: 'http://127.0.0.1:55001/OlivOSMsgApi/qq/onebot/gocqhttp' # 地址 ←看这里 ❹
```

配置完了（重重倒下）。

## 启动程序

现在把 WinSCP 丢一边（可以关闭但是可能先别）并取回 PuTTY。

Linux 命令行没有我们熟悉的图形界面窗口，因此需要使用之前安装的 Screen 分别启动 go-cqhttp 和 OlivOS。

新建“窗口”启动 go-cqhttp：

```bash
screen -S go
cd /home/OlivOS/lib && ./go-cqhttp
```

第一次登录需要扫码，请提前在手机 QQ 登录机器人账号做好准备。如果二维码太大无法完全显示，请手动拉大 PuTTY 窗口，千万不要直接最大化，图片会直接消失 (ﾟД ﾟ)

登录后就可以按 `Ctrl+a` `d` “最小化” go 窗口了（同时按下 `Ctrl` 和 `a`，然后按住`Ctrl` 松开 `a` 按下 `d`）。再次新建窗口启动 OlivOS：

```bash
screen -S oliv
python3 /home/OlivOS/main.py
```

复制骰子认主口令（命令行选中即复制），以本人 QQ 发给机器人 QQ（注意删除不必要的空行），认主成功即说明运行正常。

如果没有进一步自定义需求，现在就可以关闭 PuTTY 和 WinSCP，开始玩骰子了。

~~自定义方面有空可能会写。~~
