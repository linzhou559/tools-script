import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface CropArea {
  left: number;
  top: number;
  width: number;
  height: number;
}

async function cropImage(
  inputPath: string,
  outputPath: string,
  cropArea: CropArea
): Promise<void> {
  try {
    await sharp(inputPath).extract(cropArea).toFile(outputPath);
    console.log(`Processed ${inputPath} and saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

function processDirectory(
  inputDir: string,
  outputDir: string,
  cropArea: CropArea
): void {
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
const inputDirectory = '/mnt/c/Users/sxy/Desktop/新建文件夹';
const outputDirectory = 'b';

// Define the crop area (left, top, width, height)
// Example: { left: 100, top: 100, width: 300, height: 300 }
const cropArea: CropArea = { left: 210, top: 85, width: 1710, height: 995 };

// Ensure the output directory exists
fs.mkdir(outputDirectory, { recursive: true }, (err) => {
  if (err) {
    console.error(`Error creating directory ${outputDirectory}:`, err);
    return;
  }
  // Process the directory
  processDirectory(inputDirectory, outputDirectory, cropArea);
});
