import fs from 'fs';
import path from 'path';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

async function importNewFormatCSV() {
  try {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'Final Data Training - Red and Green flag data base - Red & Green Flag example bank (1)_1751747397428.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Skip header
    const dataLines = lines.slice(1);
    
    console.log(`Processing ${dataLines.length} CSV lines...`);
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const fields = parseCSVLine(line);
      
      if (fields.length >= 7) {
        const [theme, behaviorDescription, greenFlag, redFlag, example, impact, actionSteps] = fields;
        
        // Create green flag if exists
        if (greenFlag && greenFlag.trim() && greenFlag.trim() !== '') {
          await pool.query(`
            INSERT INTO flag_examples (
              flag_type, theme, title, description, 
              example_scenario, emotional_impact, addressability, action_steps, severity,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          `, [
            'green',
            theme?.trim() || 'general',
            greenFlag.trim(),
            behaviorDescription?.trim() || '',
            example?.trim() || '',
            impact?.trim() || '',
            'medium',
            actionSteps?.trim() || '',
            'low'
          ]);
        }
        
        // Create red flag if exists
        if (redFlag && redFlag.trim() && redFlag.trim() !== '') {
          await pool.query(`
            INSERT INTO flag_examples (
              flag_type, theme, title, description, 
              example_scenario, emotional_impact, addressability, action_steps, severity,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          `, [
            'red',
            theme?.trim() || 'general',
            redFlag.trim(),
            behaviorDescription?.trim() || '',
            example?.trim() || '',
            impact?.trim() || '',
            'medium',
            actionSteps?.trim() || '',
            'medium'
          ]);
        }
      }
    }
    
    const { rows: flagCount } = await pool.query('SELECT COUNT(*) FROM flag_examples');
    console.log(`Import complete! Total flag examples in database: ${flagCount[0].count}`);
    
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await pool.end();
  }
}

importNewFormatCSV();