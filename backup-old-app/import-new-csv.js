import fs from 'fs';
import path from 'path';
import { db } from './server/db.js';
import { flagExamples } from './shared/schema.js';

async function importNewCSV() {
  try {
    // Clear existing flag examples
    await db.delete(flagExamples);
    console.log('Cleared existing flag examples');
    
    // Read the new CSV file
    const csvPath = path.join(process.cwd(), 'attached_assets', 'Final Data Training - Red and Green flag data base - Red & Green Flag example bank (1)_1751747397428.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    
    let imported = 0;
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line handling quoted multi-line cells
      const fields = [];
      let currentField = '';
      let inQuotes = false;
      let lineIndex = i;
      
      while (lineIndex < lines.length) {
        const currentLine = lines[lineIndex];
        
        for (let j = 0; j < currentLine.length; j++) {
          const char = currentLine[j];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            fields.push(currentField.trim());
            currentField = '';
          } else {
            currentField += char;
          }
        }
        
        if (!inQuotes) {
          fields.push(currentField.trim());
          break;
        } else {
          currentField += '\n';
          lineIndex++;
        }
      }
      
      // Update main loop index
      i = lineIndex;
      
      // Process the parsed row - New format: Theme, Behavior Description, Green Flag, Red Flag, Example, Impact, Action Steps
      if (fields.length >= 7) {
        const [theme, behaviorDesc, greenFlag, redFlag, example, impact, actionSteps] = fields;
        
        if (theme && behaviorDesc && greenFlag && redFlag) {
          try {
            // Import green flag
            await db.insert(flagExamples).values({
              flagType: 'green',
              title: greenFlag.replace(/💚/g, '').trim(),
              description: behaviorDesc,
              exampleScenario: `Healthy approach: ${greenFlag}`,
              emotionalImpact: 'Builds trust and emotional safety',
              actionSteps: 'Continue this positive pattern',
              theme: theme.trim(),
              severity: 'minor',
              addressability: 'always_worth_addressing'
            });
            imported++;
            
            // Import red flag
            await db.insert(flagExamples).values({
              flagType: 'red',
              title: redFlag.replace(/🚩/g, '').trim(),
              description: behaviorDesc,
              exampleScenario: example || `Unhealthy approach: ${redFlag}`,
              emotionalImpact: impact || 'Creates emotional disconnection',
              actionSteps: actionSteps || 'Address this pattern directly',
              theme: theme.trim(),
              severity: 'moderate',
              addressability: 'sometimes_worth_addressing'
            });
            imported++;
            
            console.log(`Imported pair for theme: ${theme.trim()}`);
          } catch (error) {
            console.log(`Skipped duplicate for theme: ${theme.trim()}`);
          }
        }
      }
    }
    
    console.log(`Successfully imported ${imported} flag examples from ${imported/2} behavior pairs`);
  } catch (error) {
    console.error('Error importing CSV:', error);
  }
}

// Run the import
importNewCSV().then(() => {
  console.log('Import completed');
  process.exit(0);
}).catch(error => {
  console.error('Import failed:', error);
  process.exit(1);
});