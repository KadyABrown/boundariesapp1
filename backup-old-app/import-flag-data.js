import { readFileSync } from 'fs';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  webSocketConstructor: ws 
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

function mapAddressability(value) {
  if (!value) return 'sometimes_worth_addressing';
  const val = value.toLowerCase();
  if (val.includes('always') || val === 'yes') return 'always_worth_addressing';
  if (val.includes('dealbreaker') || val.includes('never')) return 'dealbreaker';
  return 'sometimes_worth_addressing';
}

async function importFlagData() {
  try {
    const csvData = readFileSync('attached_assets/Data Training - Red and Green flag data base - Red & Green Flag example bank_1751321668876.csv', 'utf8');
    const lines = csvData.split('\n').filter(line => line.trim());
    
    let imported = 0;
    let skipped = 0;
    
    // Skip header rows (first 2 lines)
    for (let i = 2; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length < 8) {
        skipped++;
        continue;
      }
      
      const [greenFlag, redFlag, behaviorDesc, example, impact, worthAddressing, actionSteps, theme] = values;
      
      // Import Green Flag
      if (greenFlag && greenFlag.trim()) {
        try {
          await pool.query(`
            INSERT INTO flag_examples (
              flag_type, title, description, example_scenario, 
              emotional_impact, addressability, action_steps, theme, severity
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (title) DO NOTHING
          `, [
            'green',
            greenFlag.replace(/💚/g, '').trim(),
            behaviorDesc || greenFlag,
            example,
            impact,
            'always_worth_addressing',
            actionSteps,
            theme || 'general',
            'minor'
          ]);
          imported++;
        } catch (error) {
          console.log(`Skipped green flag: ${greenFlag.substring(0, 50)}...`);
          skipped++;
        }
      }
      
      // Import Red Flag
      if (redFlag && redFlag.trim()) {
        try {
          await pool.query(`
            INSERT INTO flag_examples (
              flag_type, title, description, example_scenario, 
              emotional_impact, addressability, action_steps, theme, severity
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (title) DO NOTHING
          `, [
            'red',
            redFlag.replace(/🚩/g, '').trim(),
            behaviorDesc || redFlag,
            example,
            impact,
            mapAddressability(worthAddressing),
            actionSteps,
            theme || 'general',
            'moderate'
          ]);
          imported++;
        } catch (error) {
          console.log(`Skipped red flag: ${redFlag.substring(0, 50)}...`);
          skipped++;
        }
      }
    }
    
    console.log(`Import complete! Imported: ${imported}, Skipped: ${skipped}`);
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await pool.end();
  }
}

importFlagData();