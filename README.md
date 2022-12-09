<div align="center">

# ComicAutomaticPacking

📥 一个将tonquer/picacg-qt下载的漫画打包为CBZ格式的工具 📥

<img src="https://raw.githubusercontent.com/Discut/ComicAutomaticPacking/main/image/show%20v1.2.0.gif" width="80%" /></div>

## 安装
```bash
$ npm install -g @discut/comic_automatic_packing
# or
...
```
## 使用

```bash
$ cap
# or
$ cap -s [扫描路径]
# or
$ cap -p [输出路径]
# or
$ cap -s [扫描路径] -p [输出路径]

# 例如
$ cap -s F:/comic/commies -o F:/
# 将扫描F:/comic/commies路径，并输出至F:/
```
如果不附带扫描参数，会自动扫描运行时路径

如果连接错误请试着配置代理。

未在linux和mac上测试

## 配置
```bash
$ cap account -e [pica账号] -p [pica密码]

$ cap proxy -h [代理主机] -p [端口号]

$ cap compress -l [压缩等级]

# 更多帮助请使用-h 查看， 例如
$ cap -h

$ cap account -h
```
或者

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

## 感谢以下项目
  ### pica api
   [![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=l2studio&repo=picacomic-api)](https://github.com/l2studio/picacomic-api) 

 ### tonquer/picacg-qt
   [![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=tonquer&repo=picacg-qt)](https://github.com/tonquer/picacg-qt) 

   和本项目所使用的所有仓库

## 说明
1. 此项目仅供个人学习研究，严禁用于商业用途

## License
MIT license
