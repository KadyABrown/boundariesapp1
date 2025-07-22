import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  result.push(current.trim());
  return result;
}

async function importCompleteCSV() {
  try {
    const csvPath = path.join(__dirname, 'attached_assets', 'Data Training - Red and Green flag data base - Red & Green Flag example bank_1751322832047.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    
    // Skip header lines
    const dataLines = lines.slice(2).filter(line => line.trim() && !line.startsWith(',,'));
    
    const pairedBehaviors = [];
    let currentRow = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;
      
      const fields = parseCSVLine(line);
      
      // If this line starts with content in the first column, it's a new row
      if (fields[0] && fields[0] !== '') {
        // Process previous row if it exists
        if (currentRow.length > 0) {
          pairedBehaviors.push(processRow(currentRow));
        }
        currentRow = fields;
      } else {
        // This is a continuation of the previous row
        for (let j = 0; j < fields.length; j++) {
          if (fields[j] && fields[j] !== '') {
            if (currentRow[j]) {
              currentRow[j] += '\n' + fields[j];
            } else {
              currentRow[j] = fields[j];
            }
          }
        }
      }
    }
    
    // Process the last row
    if (currentRow.length > 0) {
      pairedBehaviors.push(processRow(currentRow));
    }
    
    console.log('Processed behaviors:', JSON.stringify(pairedBehaviors, null, 2));
    return pairedBehaviors;
    
  } catch (error) {
    console.error('Error reading CSV:', error);
    return [];
  }
}

function processRow(fields) {
  return {
    greenFlag: fields[0] || '',
    redFlag: fields[1] || '',
    description: fields[2] || '',
    example: fields[3] || '',
    impact: fields[4] || '',
    addressability: fields[5] || '',
    actionSteps: fields[6] || '',
    theme: (fields[7] || 'general').toLowerCase().replace(/\s+/g, '_')
  };
}

// Run the import
importCompleteCSV();