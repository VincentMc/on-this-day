import * as fs from 'fs';
import * as path from 'path';

const directoryPath = path.join(__dirname, '../data');
const outputFilePath = path.join(__dirname, '../data/all-years.json');

const combineJsonFiles = () => {
  const allFiles = fs.readdirSync(directoryPath);
  const combinedData: any[] = [];

  allFiles.forEach((file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(directoryPath, file);
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      combinedData.push(...fileData);
    }
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(combinedData, null, 2));
  console.log(`Combined JSON written to ${outputFilePath}`);
};

combineJsonFiles();
