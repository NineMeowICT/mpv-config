# mpv config
带有一些优化体验的自制脚本的 mpv 配置文件 ([特色功能](#特色功能))

## 使用

**Linux 安装方法: 如果你已经在使用 Linux 了，那么这应该难不倒你。**

**以下是 Windows 10+ 安装方法**

### 安装

1. 前往 GitHub Actions 下载最新版本并解压: <https://github.com/Hill-98/mpv-config/actions>
2. 运行配置脚本: `setup\setup.bat`
3. 打开 Windows 设置或控制面板设置文件关联。

如何下载 GitHub Actions 的文件: <https://docs.github.com/actions/managing-workflow-runs/downloading-workflow-artifacts>

### 更新

0. 运行旧版本清理脚本: `clean.bat`
1. 前往 GitHub Actions 下载最新版本并解压到旧版本目录: <https://github.com/Hill-98/mpv-config/actions>
2. 运行配置脚本: `setup\setup.bat`
3. 打开 Windows 设置或控制面板设置文件关联。

> 如果你擅长使用 Git，也可以使用 git 将此仓库克隆到本地进行安装。（需要 [Git LFS](https://git-lfs.com/) 和 [Git 符号链接](https://github.com/git-for-windows/git/wiki/Symbolic-Links) 支持）

## 说明

**控制界面:** [UOSC](https://github.com/tomasklaen/uosc) (有右键菜单)

**默认配置:**
* 特定于文件的配置文件 (`use-filedir-conf`)
* 中文音频/字幕优先 (日文、英文其次)
* 退出时保存当前文件已更改的[部分选项](#默认保存的文件选项) (`save-position-on-quit`)
* 始终启用缓存 (256M)
* 模糊匹配并加载外部音频文件
* 垂直同步 (`video-sync=display-resample`)
* 字幕字体: [文泉驿微米黑](http://wenq.org/wqy2/)
* 字幕字体提供程序: `fontconfig` (支持自动加载当前播放文件路径下 `fonts` 文件夹的字体文件，详情见[特色功能](#auto-load-fonts)。)

**默认视频配置 (gpu-hq-enhance):**
* profiles: `gpu-hq`
* `scale` = `lanczos`
* 着色器: [`KrigBilateral`](https://gist.github.com/igv/a015fc885d5c22e6891820ad89555637), [`SSimSuperRes`](https://gist.github.com/igv/2364ffa6e81540f29cb7ab4c9bc05b6b)
* 垂直同步 (`tscale=oversample`)
* 10 位色深视频禁用去带 (deband)

> 可以使用快捷键 `~` 回退到 `gpu-hq`，然后还可以使用快捷键 ``Alt+` `` 回退到 `default`。

**极速模式:** 可以在右键菜单中启用此模式，仅对本次播放生效。此模式将卸载所有着色器、回退到 `default` 配置文件、开启硬件解码、禁用垂直同步。适合低性能设备播放 4K60FPS 等视频文件时开启，或便携设备使用电池时开启。

**4K 显示设备播放 1080P 视频:**

4K 以及更大的显示设备播放 1080P 或更低分辨率的视频是比较常见的情况，因为显示分辨率会大于视频分辨率，播放器需要使用升采样算法将视频提升到对应分辨率再输出，升采样算法的质量、特点决定了升采样后视频的质量。

这个配置文件默认使用的升采样算法是 [lanczos](https://mpv.io/manual/master/#options-lanczos) 配合 [SSimSuperRes](https://gist.github.com/igv/2364ffa6e81540f29cb7ab4c9bc05b6b) 增强着色器，[lanczos](https://mpv.io/manual/master/#options-lanczos) 拥有中等的质量和速度，特征是比较锐利，对于大多数内容来说，这是个不错的选择，但如果是动漫，特别是日本 2D 动漫，它可能会使视频的线条看起来有些奇怪。

当你觉得升采样算法导致视频看起来比较奇怪时，可以使用右键菜单或快捷键切换至其他升采样着色器，使视频画面尽可能的完美。

如果你为某个视频找到了适合它的着色器，可以通过 [Auto Press Key](#auto-press-key) 功能使其播放时自动激活。

**HDR 视频播放:**

如果你的显示设备不支持 HDR，那么播放 HDR 视频不需要做任何事，mpv 会自动将其转换为 SDR。

如果你的显示设备支持 HDR，先在系统设置里启用 HDR，然后启用 mpv 的 HDR 直通选项，你可以修改 `local.conf` 文件。

`local.conf`:（添加以下行）
```conf
target-colorspace-hint=yes # HDR 直通
```

> 显示设备支持 HDR 不代表它可以完美的显示 HDR 内容，只是它可以处理 HDR 信号。如果你的显示设备只是支持 HDR，没有 [VESA Display HDR](https://displayhdr.org) 等标准认证，建议不要开启 HDR 直通，而是继续让 mpv 将其转换为 SDR，即使拥有认证，我也建议只在拥有 Display HDR 600 及以上认证或类似认证的显示设备开启。

> 如果你的显示设备是电视，即使不拥有任何标准认证，HDR 体验依然可能会很优秀。

**HDR 视频截图:** 播放 HDR 视频并截图，mpv 会为截图文件写入色彩空间标签并使用与视频相同的位深（仅支持部分图片格式），但是目前支持色彩空间、高位深和 HDR 的图片查看器少之又少，导致 HDR 截图在大部分图片查看器并不能正确的显示。如果你有显示 HDR 截图的需求，或者想把 HDR 截图分享给他人，推荐使用 [Google Chrome](https://chrome.google.com) 或 mpv 查看图片，分享给他人务必以文件的形式发送，切勿使用 IM 或其他软件的发送图片功能，以及确保他人拥有 HDR 显示设备。

### 默认保存的文件选项:

```txt
af 音频过滤器
vf 视频过滤器
aid 音频轨道
sid 字幕轨道
vid 视频轨道
deband 去带
panscan 平移和扫描
pause 暂停状态
speed 播放速度
audio-delay 音频延迟
video-rotate 视频旋转
video-sync 垂直同步
video-zoom 视频缩放
sub-delay 字幕延迟
sub-font-size 字幕字体大小
sub-pos 字幕位置
volume 音量
```

> 当文件播放时，这些选项如果被更改，并且文件播放没有结束，mpv 正常退出时，将保存更改的选项，在下次播放此文件时应用这些更改。

> 可以使用快捷键 `DEL` 删除当前文件保存的选项。

### 不完整快捷键列表:
```txt
BackSpace 重置播放速度
Alt+= 增加字幕字体大小
Alt+- 减小字幕字体大小
Alt+UP   字幕位置向上
Alt+DOWN 字幕位置向下
Alt+RIGHT 字幕延迟增加
Alt+LEFT  字幕延迟减少
Alt+Shift+RIGHT 音频延迟增加
Alt+Shift+LEFT  音频延迟减少
Shift+RIGHT 快进 60 秒
Shift+LEFT  倒退 60 秒
PAGE DOWN 播放列表上一个
PAGE UP   播放列表下一个
[ 上一帧
] 下一帧
< 减少播放速度
> 增加播放速度
A 显示音频轨道列表
C 显示章节列表
d 切换去带
f 切换全屏
H 开启/关闭 硬件解码 (默认关闭)
m 切换静音
o 打开文件
p 显示播放进度
P 显示播放列表
r 旋转视频
R 从头开始播放视频
s 截图
S 显示字幕轨道列表
t 显示系统时间
v 开启/关闭 垂直同步 (默认开启)
V 显示视频轨道列表
Ctrl+c 切换自动裁剪黑边
Ctrl+p 填充黑边使视频比例与当前窗口比例相同 (解决视频比例大于屏幕比例时字幕位置偏高)
```

> 快捷键区分大小写，可以在键盘未开启大写锁定时使用 `Shift + 字母` 输入对应大写快捷键。

## 自定义配置

**为了方便自定义配置，我编写了一些辅助脚本，既可以自定义配置，又不会覆盖原有的配置文件，方便后续更新。**

如果你需要自定义选项，可以修改配置目录的 `local.conf` 文件。

如果你需要修改默认加载的 profile，可以在配置文件目录创建 `profiles.local`，语法参考 `profiles` 文件。

如果你需要自定义快捷键，并且想要继承默认快捷键，按以下步骤操作:

1. `local.conf` 开头添加行:
```conf
input-conf="~~/.input.conf"
script-opts-append="custom_input-enable=yes"
```
2. 在配置目录创建 `input.local.conf` 文件并添加行:
```conf
#@ ~~/input.conf
```
3. 在 `input.local.conf` 文件设置新的快捷键
4. 每次更改文件后，启动一次 mpv 然后退出，新的快捷键将在下次启动时生效。

如果你需要自定义脚本选项，可以在 `local.conf` 使用 `script-opts-append` 设置:
```
script-opts-append="auto_load_fonts-compatible_mode=yes" # 启用 Auto Load Fonts 兼容模式
```

## 特色功能

### [Auto Load Fonts](scripts/auto-load-fonts.js)

使用 **fontconfig** 或 **[sub-fonts-dir](https://mpv.io/manual/master/#options-sub-fonts-dir)** (native) 加载播放文件路径下字体文件夹的字体文件，`native` 加载方法需要较新版本的 mpv。如果当前 mpv 构建支持，默认使用 `native` 方法，否则使用 `fontconfig` 方法。

**支持的字体文件夹:**
* fonts
* Fonts
* FONTS
* 字体

> 由于 Windows 路径名不区分大小写，所以 `fonts`, `Fonts`, `FONTS` 没有区别。

**兼容模式:** 兼容模式主要用于解决一些 fontconfig 的性能问题和 Windows 某些分区上的错误，脚本在兼容模式下加载字体文件时会将 `fonts` 文件夹复制到指定位置，然后使用新位置进行加载。默认位置为配置目录的 `.fonts` 目录，如果配置目录所在分区也存在兼容性问题，你还可以自定义兼容目录位置。

> 兼容模式在 `native` 模式下也会生效，不过可能没有任何改善。

**选项:**

兼容模式: `auto_load_fonts-compatible_mode=[yes|no] # 默认关闭`

兼容目录: `auto_load_fonts-compatible_dir=D:\fonts-cache # 设置兼容目录为 D:\fonts-cache`

加载方法：`auto_load_fonts-method=[fontconfig|native] # fontconfig 或 native`

> Auto Load Fonts 支持选项实时更新，可以配合 `profile-cond` 按需开启兼容模式。

### [Auto Press Key](scripts/auto-press-key.js)

如果播放文件目录存在 `mpv.keys` 或 `${filename}.mpv.keys`，则在文件加载后自动按下按键，文件结束后再次按下按键。

`mpv.keys`: 每行一个按键，可以是组合键，以 `!` 开头的按键不会在文件结束后再次按下，以 `#` 开头的行会被忽略。

### [Best Display Fps](scripts/best-display-fps)

自动将显示设备刷新率设置为支持范围内最适合视频帧率的刷新率，比如视频帧率为 30 FPS，显示设备如果支持 30Hz 刷新率，那么就设置为 30Hz，如果不支持 30Hz，但是支持 60 Hz，就设置为 60Hz，因为 60 是 30 的倍数。

目前仅支持 Windows，不支持 Linux。与其他类似脚本不同的是，此脚本在 Windows 不依赖第三方工具，相关操作使用 PowerShell + Win32 API 实现。

> 正常情况不推荐使用这个脚本，因为默认的垂直同步已经足够了。除非你有强迫症或者是为了节能想关闭垂直同步。

**选项:**

启用: `best_display_fps-enable=yes # 默认禁用`

切换显示器后的延迟: `best_display_fps-change_display_delay=3000 # 将 mpv 移动至另一个显示器后，延迟多少毫秒执行更改刷新率等操作。`

文件结束后的延迟: `best_display_fps-end_file_delay=3000 # 文件结束后，延迟多少毫秒执行还原刷新率等操作。`

刷新率更改时暂停等待时间: `best_display_fps-pause_wait_delay=2000 # 更改显示器刷新率时，将暂停播放，在指定毫秒后恢复播放。`

### [Check Update](scripts/check-update.js)

自动检查配置文件更新，还支持 mpv 新版本检查，mpv 默认检查源 : [shinchiro/mpv-winbuild-cmake](https://github.com/shinchiro/mpv-winbuild-cmake)。

配置文件默认每 7 天检查一次， mpv 默认每 1 天检查一次。

可以通过 `script-message check-update/config` 或 `script-message check-update/mpv` 命令强制检查更新。

网络请求依赖于外部工具 `curl`，如果 mpv 选项 `http-proxy` 已设置，会自动设置为 HTTP 代理，也支持为这个脚本单独设置 HTTP 代理，以及 curl 会自动使用 HTTP 代理相关环境变量。

**选项:**

配置文件检查间隔: `check_update-check_config_interval=3 # 每 3 天检查一次配置文件更新`。

mpv 新版本检查: `check_update-check_mpv_update=[yes|no] # 默认关闭`。

mpv 检查间隔: `check_update-check_mpv_interval=3 # 每 3 天检查一次 mpv 更新`

mpv 检查源: `check_update-check_mpv_repo=shinchiro/mpv-winbuild-cmake # 设置检查源为 https://github.com/shinchiro/mpv-winbuild-cmake`

HTTP 代理: `check_update-http_proxy=http://127.0.0.1:8080 # 设置 HTTP 代理为 http://127.0.0.1:8080` 

### [Format Title](scripts/format-title.js)

如果当前媒体文件没有内嵌媒体标题，则使用多种规则提取媒体文件名包含的信息并格式化。如果提取成功，设置为当前文件的媒体标题 (`force-media-title`)。

比如文件名 `[VCB-Studio] Re Zero kara Hajimeru Isekai Seikatsu [01][Ma10p_1080p][x265_flac_aac]` 会被格式化为 `Re Zero kara Hajimeru Isekai Seikatsu [01]`。

**选项:**

禁用: `format_title-enable=no`

### [WebPlay](scripts/webplay-handler.js)

为 mpv 新增 `webplay` 协议，用于从浏览器调用 mpv 播放媒体。

可以配合油猴脚本 [WebPlay for ytdl](https://github.com/Hill-98/userscripts/raw/main/webplay-ytdl.user.js) 使用。
