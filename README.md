<div align="center">

# ComicAutomaticPacking

📥 一个将tonquer/picacg-qt下载的漫画打包为CBZ格式的工具 📥

<img src="https://raw.githubusercontent.com/Discut/ComicAutomaticPacking/main/image/show%20v1.1.0.gif" width="65%" height="40%" /></div>

## 安装
```cmd
npm install --save @discut/comic_automatic_packing
or
...
```
## 配置

修改setting.json文件
```
路径：
%appdata%\npm\node_modules\@discut\comic_automatic_packing\lib\config\setting.json
```
![setting image](https://github.com/Discut/ComicAutomaticPacking/blob/main/image/setting%20v1.1.0.png?raw=true)

| 字段                       | 说明              |
| ------------------------- | ---------------- |
| timeout                   | 连接超时时间     |
| isProxy                   | 是否开启代理     |
| proxy                     | 代理设置         |
| account（重要！必须配置） | pica账号配置     |
| outputPath                | 打包漫画输出目录 |

## 使用

进入下载根目录后，使用命令
```cmd
cap
```
它会扫描根目录下的所有目录并匹配漫画，最后输出cbz包。

如果连接错误请试着配置代理。

## 感谢以下项目
  ### pica api
   [![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=l2studio&repo=picacomic-api)](https://github.com/l2studio/picacomic-api) 

   和本项目所使用的所有仓库

## 说明
1. 此项目仅供个人学习研究，严禁用于商业用途

## License
MIT license
