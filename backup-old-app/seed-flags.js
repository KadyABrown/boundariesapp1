import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  webSocketConstructor: ws 
});

const sampleFlags = [
  {
    flagType: 'green',
    title: 'Respects your boundaries like a pro',
    description: 'This person consistently honors your stated limits without pushback, guilt-tripping, or repeated boundary testing.',
    exampleScenario: 'When you say "I need some space tonight to recharge," they respond with "Of course! Let me know when you feel ready to connect again."',
    emotionalImpact: 'Creates safety, trust, and emotional security in the relationship. Reduces anxiety and builds confidence in expressing needs.',
    addressability: 'always_worth_addressing',
    actionSteps: 'Express appreciation: "I really value how you respect my boundaries. It makes me feel safe and heard."',
    theme: 'respect',
    severity: 'moderate'
  },
  {
    flagType: 'red',
    title: 'Dismisses your feelings',
    description: 'Regularly invalidates your emotions or tells you that your feelings are wrong, overreacting, or unreasonable.',
    exampleScenario: 'When you express hurt about something they did, they say "You\'re being too sensitive" or "That\'s not what I meant, you\'re overreacting."',
    emotionalImpact: 'Erodes self-trust, creates self-doubt, and can lead to emotional suppression and anxiety.',
    addressability: 'sometimes_worth_addressing',
    actionSteps: 'Set clear boundaries: "My feelings are valid. I need you to listen and acknowledge them, not dismiss them."',
    theme: 'emotional_safety',
    severity: 'moderate'
  },
  {
    flagType: 'green',
    title: 'Communicates openly about conflicts',
    description: 'Addresses disagreements directly, honestly, and constructively without avoiding difficult conversations.',
    exampleScenario: 'Says "I noticed we had different opinions about that decision. Can we talk through it together and find a solution that works for both of us?"',
    emotionalImpact: 'Builds trust, prevents resentment from building, and strengthens the relationship through honest dialogue.',
    addressability: 'always_worth_addressing',
    actionSteps: 'Acknowledge and reciprocate: "I appreciate how you approach conflicts with honesty. It helps me feel safe to be open too."',
    theme: 'communication',
    severity: 'minor'
  },
  {
    flagType: 'red',
    title: 'Love bombing followed by withdrawal',
    description: 'Excessive attention, affection, and promises early on, followed by emotional distance or withholding.',
    exampleScenario: 'Showers you with constant texts, expensive gifts, and grand gestures for weeks, then suddenly becomes distant and barely communicates.',
    emotionalImpact: 'Creates confusion, anxiety, and emotional dependency. Can be a manipulation tactic.',
    addressability: 'dealbreaker',
    actionSteps: 'Trust your instincts and consider ending the relationship. This pattern rarely changes and often escalates.',
    theme: 'emotional_consistency',
    severity: 'dealbreaker'
  },
  {
    flagType: 'green',
    title: 'Shows up consistently',
    description: 'Follows through on plans, commitments, and promises. You can rely on them to do what they say they will do.',
    exampleScenario: 'Always arrives on time for dates, keeps promises about calling when they say they will, and follows through on commitments.',
    emotionalImpact: 'Builds trust, security, and confidence in the relationship\'s stability.',
    addressability: 'always_worth_addressing',
    actionSteps: 'Express appreciation: "I really value how reliable you are. It makes me feel secure in our relationship."',
    theme: 'trust_reliability',
    severity: 'minor'
  }
];

async function seedFlagExamples() {
  try {
    console.log('Seeding flag examples...');
    
    for (const flag of sampleFlags) {
      await pool.query(`
        INSERT INTO flag_examples (
          flag_type, title, description, example_scenario, 
          emotional_impact, addressability, action_steps, theme, severity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (title) DO NOTHING
      `, [
        flag.flagType,
        flag.title,
        flag.description,
        flag.exampleScenario,
        flag.emotionalImpact,
        flag.addressability,
        flag.actionSteps,
        flag.theme,
        flag.severity
      ]);
    }
    
    console.log(`Successfully seeded ${sampleFlags.length} flag examples`);
  } catch (error) {
    console.error('Error seeding flag examples:', error);
  } finally {
    await pool.end();
  }
}

seedFlagExamples();