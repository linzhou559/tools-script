import fs from 'fs';
import { fabric } from 'fabric';

// 图片宽高
const width = 200;
const height = 200;
// 图片中文字内容
const showText = 'Hello, World! ';

// 创建一个 Canvas
const canvas = new fabric.Canvas(null, {
  width,
  height,
});

// 设置背景
canvas.setBackgroundColor('#1f883d', () => {});

// 创建文本对象
const text = new fabric.Textbox(showText, {
  left: 20,
  fill: '#fff',
  fontSize: 24,
  textAlign: 'center',
  width: width - 20,
  splitByGrapheme: true,
});

// 添加到 Canvas
canvas.add(text);

// 居中文本
canvas.centerObject(text);

// 导出为图片
const dataURL = canvas.toDataURL({
  format: 'png',
});

// 将图片保存或展示
console.log(dataURL);

// 保存为图片
fs.writeFileSync('output.png', dataURL.split(',')[1], 'base64');
