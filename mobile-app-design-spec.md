# BoundaryCore Mobile App - Complete Design Specification

## App Overview
BoundaryCore is a relationship health tracking app that automatically analyzes how well relationships align with a user's personal baseline values and needs. The app transforms subjective relationship feelings into objective data by comparing real interaction impacts against established personal needs and values.

## Core Function Flow
1. **Personal Baseline Assessment** → User establishes communication style, emotional needs, boundary requirements, triggers, and core values
2. **Comprehensive Interaction Tracking (CIT)** → Detailed logging measuring energy, anxiety, self-worth, physical symptoms before/during/after interactions
3. **Automatic Compatibility Analysis** → App compares CIT data against baseline to calculate relationship health scores
4. **Actionable Insights** → Specific recommendations based on baseline compatibility scores and pattern analysis

## Visual Design System

### Color Palette
- **Primary Blue**: #3B82F6 (trust, communication, analytical insights)
- **Success Green**: #10B981 (health, growth, positive compatibility)
- **Warning Red**: #EF4444 (warnings, deal-breakers, concerning patterns)
- **Caution Yellow**: #F59E0B (moderate issues, triggers)
- **Values Purple**: #8B5CF6 (values alignment, personal growth)
- **Neutral Gray**: #6B7280 (secondary text, backgrounds)
- **Light Gray**: #F9FAFB (card backgrounds)
- **White**: #FFFFFF (main backgrounds)

### Typography
- **Headers**: Bold, 24-32px, dark gray (#1F2937)
- **Body Text**: Regular, 16px, medium gray (#374151)
- **Secondary Text**: Regular, 14px, light gray (#6B7280)
- **Health Scores**: Bold, 36-48px, primary blue
- **Percentages**: Medium, 18px, contextual colors

### Design Philosophy
- **Calming & Non-Judgmental**: Soft, muted tones to avoid triggering anxiety
- **Medical/Clinical Aesthetic**: Clean, professional like a health tracking tool
- **Data-Driven Visualization**: Clear progress bars, percentage displays, health scores
- **Emotional Safety**: Warm grays and whites create safe space for vulnerability
- **Accessibility First**: High contrast ratios, colorblind-friendly palettes

## Screen Layouts

### 1. Personal Baseline Assessment Screen
**Purpose**: Establish user's core values, communication style, boundaries, triggers

**Layout**:
- Clean white background
- Progress indicator at top (blue)
- Large section titles in bold dark gray
- Multiple choice options as rounded cards with light gray borders
- Selected options highlighted in primary blue
- "Continue" button at bottom (blue, full width)

**Sections**:
- Communication Style (direct, gentle, collaborative, assertive)
- Emotional Needs (validation level, processing time, support type)
- Boundary Requirements (personal space, privacy, decision-making)
- Triggers (topics, situations, behaviors to avoid)
- Core Values (honesty, respect, growth, independence)

### 2. Comprehensive Interaction Tracker (CIT)
**Purpose**: Log detailed interaction data for analysis

**Layout**:
- Step-by-step wizard interface
- Progress dots at top showing 5 steps
- Large numeric scales (1-10) with emoji indicators
- Slider controls for energy/anxiety/self-worth
- Multi-select chips for symptoms/emotions
- Time picker for duration/recovery
- Text areas for notes (minimal, optional)

**5 Steps**:
1. **Pre-Interaction**: Energy (1-10), Anxiety (1-10), Self-worth (1-10), Mood
2. **Context**: Type, Duration, Location, Witnesses, Boundary testing
3. **Post-Interaction**: Energy change, Anxiety change, Self-worth change, Physical symptoms
4. **Recovery**: Time to feel normal, What helped/hurt, Coping strategies used
5. **Learning**: Warning signs noticed, Boundaries maintained, Self-advocacy actions

### 3. Relationship Health Dashboard
**Purpose**: Display baseline compatibility scores and insights

**Layout**:
- Large health score percentage at top (blue, 48px)
- Compatibility badge below score (green/yellow/red)
- Grid of metric cards showing percentages with progress bars
- Visual alerts for deal-breakers (red cards with warning icons)
- Action recommendations at bottom

**Health Score Calculation**:
- Communication Respected: 20% weight
- Boundaries Respected: 25% weight  
- Triggers Avoided: 20% weight
- Values Aligned: 15% weight
- Energy Impact: 10% weight
- Self-Worth Impact: 10% weight
- Deal-breakers: -25% penalty

**Metric Cards**:
- Communication Respected: Blue progress bar
- Boundaries Respected: Green progress bar
- Triggers Avoided: Yellow progress bar
- Values Aligned: Purple progress bar
- Average Energy Impact: +/- number (green/red)
- Average Self-Worth Impact: +/- number (green/red)

### 4. Relationship List Screen
**Purpose**: Overview of all tracked relationships

**Layout**:
- Search bar at top
- List of relationship cards
- Each card shows: Name, health score percentage, compatibility badge, last interaction date
- Add new relationship floating action button (blue, bottom right)

**Card Design**:
- White background, subtle shadow
- Health score prominent on right (large, colored)
- Name and relationship type on left
- Small trend indicator (up/down arrow)
- Tap to open detailed view

## Component Specifications

### Health Score Display
```
Large percentage number (48px, bold, blue)
Compatibility badge below (green/yellow/red)
"Based on X interactions" subtitle (14px, gray)
```

### Progress Bars
```
Height: 8px
Background: Light gray (#E5E7EB)
Fill: Contextual color (blue/green/yellow/purple)
Rounded corners
Percentage label on right
```

### Metric Cards
```
White background
Rounded corners (8px)
Subtle shadow
16px padding
Label on left (16px, medium gray)
Value on right (18px, bold, contextual color)
Progress bar below (optional)
```

### Alert Cards
```
Colored background (red/yellow tint)
Colored border
Warning icon on left
Bold title text
Descriptive subtitle
Rounded corners
```

### Navigation
```
Bottom tab bar with 4 sections:
- Dashboard (home icon)
- Relationships (people icon)  
- Tracker (chart icon)
- Settings (gear icon)
Primary blue for active tab
Gray for inactive tabs
```

## Data Integration Requirements

### Personal Baseline Storage
- Communication preferences (dropdown selections)
- Emotional needs (multi-select options)
- Boundary requirements (checkbox selections)
- Trigger categories (predefined list with custom additions)
- Core values (ranking system)

### CIT Data Structure
```javascript
{
  relationshipId: string,
  preInteraction: {
    energy: number (1-10),
    anxiety: number (1-10),
    selfWorth: number (1-10),
    mood: string
  },
  context: {
    type: string,
    duration: number (minutes),
    location: string,
    witnesses: boolean,
    boundaryTesting: boolean
  },
  postInteraction: {
    energyAfter: number (1-10),
    anxietyAfter: number (1-10),
    selfWorthAfter: number (1-10),
    physicalSymptoms: string[],
    emotions: string[]
  },
  recovery: {
    timeToNormal: number (minutes),
    helpfulActions: string[],
    harmfulActions: string[],
    copingStrategies: string[]
  },
  learning: {
    warningSigns: string[],
    boundariesMaintained: string[],
    selfAdvocacyActions: string[]
  },
  baselineAlignment: {
    communicationStyleRespected: boolean,
    boundariesRespected: boolean,
    triggersAvoided: boolean,
    coreValuesAligned: boolean,
    dealBreakersPresent: boolean
  }
}
```

### Health Score Algorithm
```javascript
function calculateHealthScore(interactions) {
  const total = interactions.length;
  const commRespected = interactions.filter(i => i.baselineAlignment.communicationStyleRespected).length;
  const boundariesRespected = interactions.filter(i => i.baselineAlignment.boundariesRespected).length;
  const triggersAvoided = interactions.filter(i => i.baselineAlignment.triggersAvoided).length;
  const valuesAligned = interactions.filter(i => i.baselineAlignment.coreValuesAligned).length;
  const dealBreakers = interactions.filter(i => i.baselineAlignment.dealBreakersPresent).length;
  
  const avgEnergyChange = interactions.reduce((sum, i) => 
    sum + (i.postInteraction.energyAfter - i.preInteraction.energy), 0) / total;
  const avgSelfWorthChange = interactions.reduce((sum, i) => 
    sum + (i.postInteraction.selfWorthAfter - i.preInteraction.selfWorth), 0) / total;
  
  const score = 
    (commRespected / total) * 20 +
    (boundariesRespected / total) * 25 +
    (triggersAvoided / total) * 20 +
    (valuesAligned / total) * 15 +
    Math.max(0, (5 + avgEnergyChange) / 10) * 10 +
    Math.max(0, (5 + avgSelfWorthChange) / 10) * 10 -
    (dealBreakers / total) * 25;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}
```

## Key UI Principles

1. **No Manual Flag Entry** - All relationship analysis comes from CIT data compared to baseline
2. **Automatic Pattern Recognition** - App identifies concerning patterns without user input
3. **Objective Metrics** - Focus on measurable impacts (energy, self-worth, physical symptoms)
4. **Baseline-Centric** - Everything compared against user's established needs and values
5. **Health-Focused Language** - Clinical, non-judgmental terminology
6. **Data Visualization** - Clear charts, percentages, progress indicators
7. **Actionable Insights** - Specific recommendations based on compatibility analysis

## Technical Requirements

- React Native or Flutter
- Local database for sensitive data
- Secure authentication
- Data export capabilities
- Offline functionality for CIT logging
- Push notifications for check-in reminders
- Accessibility compliance (screen readers, high contrast)

## Content Guidelines

### Tone & Voice
- Supportive but clinical
- Non-judgmental
- Empowering through data
- Focuses on user agency and choice
- Avoids relationship advice
- Presents objective analysis

### Terminology
- "Compatibility" not "good/bad relationship"
- "Baseline alignment" not "right/wrong"
- "Health score" not "relationship score"
- "Pattern analysis" not "red flags"
- "Concerning indicators" not "warnings"

This specification should provide the mobile agent with everything needed to build a consistent, functional app that matches your vision.