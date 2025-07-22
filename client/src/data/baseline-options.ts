// Predefined, trackable baseline options
export const BASELINE_OPTIONS = {
  communicationStyles: [
    { value: 'direct', label: 'Direct - I say what I mean clearly' },
    { value: 'gentle', label: 'Gentle - I prefer softer approaches' },
    { value: 'collaborative', label: 'Collaborative - We figure it out together' },
    { value: 'assertive', label: 'Assertive - I stand up for my needs' }
  ],

  conflictResolution: [
    { value: 'discuss-immediately', label: 'Address right away when issues come up' },
    { value: 'need-time-to-process', label: 'Give me time to think before discussing' },
    { value: 'avoid-conflict', label: 'Prefer to avoid confrontation when possible' },
    { value: 'address-when-calm', label: 'Wait until we\'re both calm to discuss' }
  ],

  // Measurable emotional triggers (behaviors that can be tracked)
  emotionalTriggers: [
    { value: 'interrupting', label: 'Being interrupted while speaking', category: 'communication' },
    { value: 'dismissive-tone', label: 'Dismissive or condescending tone', category: 'communication' },
    { value: 'raised-voice', label: 'Raised voice or yelling', category: 'communication' },
    { value: 'ignoring-boundaries', label: 'Ignoring stated boundaries', category: 'respect' },
    { value: 'last-minute-changes', label: 'Last minute plan changes', category: 'reliability' },
    { value: 'not-following-through', label: 'Not following through on commitments', category: 'reliability' },
    { value: 'criticism-in-public', label: 'Being criticized in front of others', category: 'respect' },
    { value: 'pressure-decisions', label: 'Being pressured to make quick decisions', category: 'autonomy' },
    { value: 'emotional-manipulation', label: 'Guilt trips or emotional manipulation', category: 'emotional-safety' },
    { value: 'silent-treatment', label: 'Silent treatment or withdrawal', category: 'emotional-safety' },
    { value: 'comparing-others', label: 'Being compared to other people', category: 'emotional-safety' },
    { value: 'invalidating-feelings', label: 'Having feelings dismissed or invalidated', category: 'emotional-safety' }
  ],

  // Trackable comfort behaviors (what helps when upset)
  comfortingBehaviors: [
    { value: 'active-listening', label: 'Active listening without trying to fix', category: 'communication' },
    { value: 'physical-affection', label: 'Hugs, hand-holding, physical comfort', category: 'physical' },
    { value: 'give-space', label: 'Giving me space to process emotions', category: 'space' },
    { value: 'validate-feelings', label: 'Validating my feelings without judgment', category: 'emotional' },
    { value: 'problem-solve-together', label: 'Working together to find solutions', category: 'collaboration' },
    { value: 'distraction-activities', label: 'Doing fun activities to lift mood', category: 'activities' },
    { value: 'words-affirmation', label: 'Words of encouragement and support', category: 'verbal' },
    { value: 'check-in-later', label: 'Checking in on me later to see how I\'m doing', category: 'follow-up' }
  ],

  // Measurable deal breaker behaviors
  dealBreakerBehaviors: [
    { value: 'verbal-abuse', label: 'Name calling, insults, or verbal abuse', category: 'abuse', severity: 'critical' },
    { value: 'physical-aggression', label: 'Any form of physical violence or threats', category: 'abuse', severity: 'critical' },
    { value: 'cheating-infidelity', label: 'Cheating or emotional infidelity', category: 'trust', severity: 'critical' },
    { value: 'substance-abuse', label: 'Serious substance abuse problems', category: 'health', severity: 'critical' },
    { value: 'chronic-lying', label: 'Habitual lying or deception', category: 'trust', severity: 'major' },
    { value: 'financial-betrayal', label: 'Stealing money or financial betrayal', category: 'trust', severity: 'major' },
    { value: 'isolating-friends-family', label: 'Trying to isolate me from friends/family', category: 'control', severity: 'major' },
    { value: 'extreme-jealousy', label: 'Extreme jealousy and possessiveness', category: 'control', severity: 'major' },
    { value: 'disrespecting-boundaries', label: 'Repeatedly ignoring stated boundaries', category: 'respect', severity: 'major' },
    { value: 'refusing-compromise', label: 'Never willing to compromise or see my side', category: 'collaboration', severity: 'moderate' },
    { value: 'public-embarrassment', label: 'Deliberately embarrassing me in public', category: 'respect', severity: 'moderate' },
    { value: 'breaking-promises', label: 'Consistently breaking important promises', category: 'reliability', severity: 'moderate' }
  ],

  // Trackable emotional needs
  emotionalNeeds: [
    { value: 'appreciation-expressed', label: 'Regular verbal appreciation and gratitude', category: 'validation' },
    { value: 'feelings-validated', label: 'Having my feelings acknowledged and validated', category: 'validation' },
    { value: 'achievements-celebrated', label: 'Celebrating my achievements and successes', category: 'celebration' },
    { value: 'support-during-stress', label: 'Extra support during stressful times', category: 'support' },
    { value: 'emotional-check-ins', label: 'Regular check-ins on my emotional wellbeing', category: 'support' },
    { value: 'encouragement-goals', label: 'Encouragement with my personal goals', category: 'growth' },
    { value: 'physical-affection', label: 'Physical affection (hugs, cuddling, etc.)', category: 'physical' },
    { value: 'quality-time', label: 'Focused, undivided attention during our time', category: 'time' }
  ],

  // Trackable communication needs
  communicationNeeds: [
    { value: 'ask-clarifying-questions', label: 'Ask clarifying questions to understand me better', category: 'understanding' },
    { value: 'summarize-back', label: 'Summarize what I said to confirm understanding', category: 'understanding' },
    { value: 'avoid-interrupting', label: 'Let me finish my thoughts without interrupting', category: 'respect' },
    { value: 'share-feelings-openly', label: 'Share their own feelings and thoughts openly', category: 'openness' },
    { value: 'give-processing-time', label: 'Give me time to process before expecting responses', category: 'time' },
    { value: 'use-gentle-tone', label: 'Use a calm, gentle tone even during disagreements', category: 'tone' },
    { value: 'follow-up-conversations', label: 'Follow up on important conversations later', category: 'follow-up' },
    { value: 'express-needs-directly', label: 'Tell me directly what they need instead of hinting', category: 'directness' }
  ],

  personalSpaceNeeds: [
    { value: 'high', label: 'High - I need significant personal space' },
    { value: 'medium', label: 'Medium - Some space is important to me' },
    { value: 'low', label: 'Low - I prefer being close and connected' }
  ],

  aloneTimeFrequency: [
    { value: 'daily', label: 'Daily - I need alone time every day' },
    { value: 'few-times-week', label: 'A few times per week' },
    { value: 'weekly', label: 'Weekly - Once a week is enough' },
    { value: 'rarely', label: 'Rarely - I don\'t need much alone time' }
  ],

  socialEnergyLevel: [
    { value: 'high', label: 'High - I have lots of social energy' },
    { value: 'medium', label: 'Medium - Moderate social energy' },
    { value: 'low', label: 'Low - Social interactions drain me quickly' }
  ]
};

// Helper functions for the app to use these trackable options
export const getTriggersByCategory = (category: string) => 
  BASELINE_OPTIONS.emotionalTriggers.filter(trigger => trigger.category === category);

export const getComfortsByCategory = (category: string) =>
  BASELINE_OPTIONS.comfortingBehaviors.filter(comfort => comfort.category === category);

export const getDealBreakersBySeverity = (severity: string) =>
  BASELINE_OPTIONS.dealBreakerBehaviors.filter(db => db.severity === severity);

export const getEmotionalNeedsByCategory = (category: string) =>
  BASELINE_OPTIONS.emotionalNeeds.filter(need => need.category === category);