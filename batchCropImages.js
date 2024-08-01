/**
 * 图片裁剪与目录处理
 * 这是一个基于 Node.js 的脚本，它使用 `sharp` 库来裁剪图片，并使用 `fs` 和 `path` 模块来处理文件和目录路径。
 * 脚本将自动读取输入目录中的图片文件，并按照裁剪区域裁剪后保存到输出目录中。对于子目录，它将递归处理。
 * 
 * Usage
 * 1. npm install node sharp
 * 2. node batchCropImages.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function cropImage(inputPath, outputPath, cropArea) {
  try {
    await sharp(inputPath).extract(cropArea).toFile(outputPath);
    console.log(`Processed ${inputPath} and saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

function processDirectory(inputDir, outputDir, cropArea) {
  fs.readdir(inputDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(`Error reading directory ${inputDir}:`, err);
      return;
    }

    entries.forEach((entry) => {
      const inputEntryPath = path.join(inputDir, entry.name);
      const outputEntryPath = path.join(outputDir, entry.name);

      if (entry.isDirectory()) {
        fs.mkdir(outputEntryPath, { recursive: true }, (err) => {
          if (err) {
            console.error(`Error creating directory ${outputEntryPath}:`, err);
            return;
          }
          processDirectory(inputEntryPath, outputEntryPath, cropArea);
        });
      } else if (entry.isFile() && /\.(png|jpe?g|bmp|gif)$/i.test(entry.name)) {
        cropImage(inputEntryPath, outputEntryPath, cropArea);
      }
    });
  });
}

// Define the input and output directories
const inputDirectory = "a";
const outputDirectory = "b";

// Define the crop area (left, top, width, height)
// Example: { left: 100, top: 100, width: 300, height: 300 }
const cropArea = { left: 210, top: 85, width: 1710, height: 995 };

// Ensure the output directory exists
fs.mkdir(outputDirectory, { recursive: true }, (err) => {
  if (err) {
    console.error(`Error creating directory ${outputDirectory}:`, err);
    return;
  }
  // Process the directory
  processDirectory(inputDirectory, outputDirectory, cropArea);
});
