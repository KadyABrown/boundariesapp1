// Predefined, trackable baseline options based on user's actual assessment
export const BASELINE_OPTIONS = {
  // Communication preferences
  communicationStyles: [
    { value: 'direct', label: 'Direct' },
    { value: 'gentle', label: 'Gentle' },
    { value: 'collaborative', label: 'Collaborative' },
    { value: 'assertive', label: 'Assertive' }
  ],

  conflictResolution: [
    { value: 'immediate-discussion', label: 'Immediate discussion' },
    { value: 'cool-down-first', label: 'Cool down first' },
    { value: 'written-communication', label: 'Written communication' },
    { value: 'with-mediator', label: 'With mediator' }
  ],

  // Energy sources - what gives energy in relationships
  energyGivers: [
    { value: 'deep-conversations', label: 'Deep conversations', category: 'intellectual' },
    { value: 'physical-affection', label: 'Physical affection', category: 'physical' },
    { value: 'shared-activities', label: 'Shared activities', category: 'activities' },
    { value: 'individual-time', label: 'Individual time', category: 'independence' },
    { value: 'problem-solving-together', label: 'Problem solving together', category: 'collaboration' }
  ],

  // Energy drains - what drains energy in relationships
  energyDrainers: [
    { value: 'conflict', label: 'Conflict', category: 'tension' },
    { value: 'neediness', label: 'Neediness', category: 'emotional-burden' },
    { value: 'dishonesty', label: 'Dishonesty', category: 'trust' },
    { value: 'drama', label: 'Drama', category: 'chaos' },
    { value: 'lack-of-communication', label: 'Lack of communication', category: 'communication' },
    { value: 'different-values', label: 'Different values', category: 'compatibility' }
  ],

  // Measurable emotional triggers (behaviors that can be tracked)
  emotionalTriggers: [
    { value: 'criticism', label: 'Criticism', category: 'feedback' },
    { value: 'being-ignored', label: 'Being ignored', category: 'attention' },
    { value: 'dishonesty', label: 'Dishonesty', category: 'trust' },
    { value: 'controlling-behavior', label: 'Controlling behavior', category: 'autonomy' },
    { value: 'disrespect', label: 'Disrespect', category: 'respect' },
    { value: 'manipulation', label: 'Manipulation', category: 'emotional-safety' }
  ],

  // Absolute deal breakers
  dealBreakerBehaviors: [
    { value: 'dishonesty', label: 'Dishonesty', category: 'trust', severity: 'major' },
    { value: 'infidelity', label: 'Infidelity', category: 'trust', severity: 'critical' },
    { value: 'abuse', label: 'Abuse', category: 'safety', severity: 'critical' },
    { value: 'addiction-issues', label: 'Addiction issues', category: 'health', severity: 'major' },
    { value: 'incompatible-values', label: 'Incompatible values', category: 'compatibility', severity: 'moderate' },
    { value: 'poor-communication', label: 'Poor communication', category: 'communication', severity: 'moderate' }
  ],

  // Personal space needs
  personalSpaceNeeds: [
    { value: 'high', label: 'High – need lots of alone time' },
    { value: 'moderate', label: 'Moderate – some alone time' },
    { value: 'low', label: 'Low – prefer being together' },
    { value: 'flexible', label: 'Flexible' }
  ],

  // Privacy preferences
  privacyPreferences: [
    { value: 'very-private', label: 'Very private' },
    { value: 'moderately-private', label: 'Moderately private' },
    { value: 'open-book', label: 'Open book' },
    { value: 'situational', label: 'Situational' }
  ],

  // Decision making style
  decisionMakingStyle: [
    { value: 'independently', label: 'Independently' },
    { value: 'collaboratively', label: 'Collaboratively' },
    { value: 'seek-advice-first', label: 'Seek advice first' },
    { value: 'depends-on-decision', label: 'Depends on decision' }
  ],

  // Emotional support level needed
  emotionalSupportLevel: [
    { value: 'high', label: 'High – constant check-ins' },
    { value: 'moderate', label: 'Moderate – regular support' },
    { value: 'low', label: 'Low – minimal support' },
    { value: 'variable', label: 'Variable – depends on situation' }
  ],

  // Love languages - how to show/receive affection
  affectionStyles: [
    { value: 'physical-touch', label: 'Physical touch', category: 'physical' },
    { value: 'words-of-affirmation', label: 'Words of affirmation', category: 'verbal' },
    { value: 'quality-time', label: 'Quality time', category: 'time' },
    { value: 'acts-of-service', label: 'Acts of service', category: 'actions' },
    { value: 'gifts', label: 'Gifts', category: 'material' }
  ],

  // Validation frequency needed
  validationFrequency: [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'rarely', label: 'Rarely' }
  ],

};

// Helper functions to organize trackable data
export const BASELINE_CATEGORIES = {
  energyImpact: ['energyGivers', 'energyDrainers'],
  triggersAndDealBreakers: ['emotionalTriggers', 'dealBreakerBehaviors'],
  boundaryRequirements: ['personalSpaceNeeds', 'privacyPreferences', 'decisionMakingStyle'],
  emotionalNeeds: ['emotionalSupportLevel', 'affectionStyles', 'validationFrequency'],
  communicationPreferences: ['communicationStyles', 'conflictResolution']
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