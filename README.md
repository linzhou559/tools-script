# node-script

## 依赖安装

```bash

pnpm install

```

## 脚本说明

1. BatchCropImages.ts

该脚本使用 sharp 库来裁剪图片，并使用 fs 和 path 模块来处理文件和目录路径。脚本将自动读取输入目录中的图片文件，并按照裁剪区域裁剪后保存到输出目录中。对于子目录，它将递归处理。

2. TextToImageGenerator.ts

使用`fabric.js`库生成图片，将文本转换为图片。