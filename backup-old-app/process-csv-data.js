import { readFileSync } from 'fs';

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

// Read and process the CSV file
const csvData = readFileSync('attached_assets/Data Training - Red and Green flag data base - Red & Green Flag example bank_1751321668876.csv', 'utf8');
const lines = csvData.split('\n').filter(line => line.trim());

const flags = [];

// Skip header rows (first 2 lines)
for (let i = 2; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  
  if (values.length < 8) continue;
  
  const [greenFlag, redFlag, behaviorDesc, example, impact, worthAddressing, actionSteps, theme] = values;
  
  // Process Green Flag
  if (greenFlag && greenFlag.trim()) {
    flags.push({
      flagType: 'green',
      title: greenFlag.replace(/💚/g, '').trim(),
      description: behaviorDesc || greenFlag,
      exampleScenario: example,
      emotionalImpact: impact,
      addressability: 'always_worth_addressing',
      actionSteps: actionSteps,
      theme: theme || 'general',
      severity: 'minor'
    });
  }
  
  // Process Red Flag
  if (redFlag && redFlag.trim()) {
    flags.push({
      flagType: 'red',
      title: redFlag.replace(/🚩/g, '').trim(),
      description: behaviorDesc || redFlag,
      exampleScenario: example,
      emotionalImpact: impact,
      addressability: mapAddressability(worthAddressing),
      actionSteps: actionSteps,
      theme: theme || 'general',
      severity: 'moderate'
    });
  }
}

console.log(`Processed ${flags.length} flags from CSV file`);
console.log('Sample data:', JSON.stringify(flags.slice(0, 2), null, 2));