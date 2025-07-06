import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function parseFullCSV() {
  try {
    const csvPath = path.join(__dirname, 'attached_assets', 'Data Training - Red and Green flag data base - Red & Green Flag example bank_1751322832047.csv');
    const content = fs.readFileSync(csvPath, 'utf-8');
    
    // Count total lines
    const allLines = content.split('\n');
    console.log(`Total lines in CSV: ${allLines.length}`);
    
    // Look for data patterns
    let dataRowCount = 0;
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i].trim();
      if (line && !line.startsWith(',,') && !line.includes('Red & Green Flag example bank')) {
        if (line.split(',').length >= 7) { // Has enough columns
          dataRowCount++;
        }
      }
    }
    
    console.log(`Estimated data rows: ${dataRowCount}`);
    console.log(`First 10 data-like lines:`);
    
    let count = 0;
    for (let i = 0; i < allLines.length && count < 10; i++) {
      const line = allLines[i].trim();
      if (line && !line.startsWith(',,') && !line.includes('Red & Green Flag example bank')) {
        if (line.split(',').length >= 7) {
          console.log(`Line ${i}: ${line.substring(0, 100)}...`);
          count++;
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

parseFullCSV();