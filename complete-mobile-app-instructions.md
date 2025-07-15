# BoundarySpace Mobile App - Complete Build Instructions

## CRITICAL: Build EXACTLY This App Structure

You are building a relationship health tracking app that automatically analyzes how relationships align with personal baseline values. DO NOT build a generic dating app or therapy app.

## Technology Stack
```
- React Native with Expo
- TypeScript
- React Navigation 6
- AsyncStorage for data persistence
- No external backend required
```

## App Structure - Build These Screens EXACTLY

### 1. Personal Baseline Setup Screen (Required First)
This screen establishes the user's core needs that all relationship analysis is based on.

```typescript
// PersonalBaselineScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const PersonalBaselineScreen = ({ navigation }) => {
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [emotionalNeeds, setEmotionalNeeds] = useState([]);
  const [boundaries, setBoundaries] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [coreValues, setCoreValues] = useState([]);

  const communicationOptions = ['Direct', 'Gentle', 'Collaborative', 'Assertive'];
  const emotionalNeedsOptions = ['High Validation', 'Processing Time', 'Physical Affection', 'Words of Affirmation'];
  const boundaryOptions = ['Personal Space', 'Privacy', 'Decision Making', 'Financial'];
  const triggerOptions = ['Raised Voice', 'Criticism', 'Dismissal', 'Interruption'];
  const valueOptions = ['Honesty', 'Respect', 'Growth', 'Independence'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personal Baseline Assessment</Text>
      <Text style={styles.subtitle}>Define your core needs for healthy relationships</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication Style</Text>
        {communicationOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.option, communicationStyle === option && styles.selectedOption]}
            onPress={() => setCommunicationStyle(option)}
          >
            <Text style={[styles.optionText, communicationStyle === option && styles.selectedText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Repeat similar sections for emotionalNeeds, boundaries, triggers, coreValues */}

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => {
          // Save baseline data
          navigation.navigate('Dashboard');
        }}
      >
        <Text style={styles.continueText}>Complete Assessment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 30 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 15 },
  option: { 
    backgroundColor: '#F9FAFB', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  selectedOption: { backgroundColor: '#EBF4FF', borderColor: '#3B82F6' },
  optionText: { fontSize: 16, color: '#374151' },
  selectedText: { color: '#3B82F6', fontWeight: '600' },
  continueButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  continueText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' }
});
```

### 2. Comprehensive Interaction Tracker Screen
This is the core data collection screen - builds CIT data for analysis.

```typescript
// InteractionTrackerScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Slider, StyleSheet } from 'react-native';

const InteractionTrackerScreen = ({ route, navigation }) => {
  const { relationshipId } = route.params;
  const [step, setStep] = useState(1);
  const [energyBefore, setEnergyBefore] = useState(5);
  const [anxietyBefore, setAnxietyBefore] = useState(5);
  const [selfWorthBefore, setSelfWorthBefore] = useState(5);
  const [energyAfter, setEnergyAfter] = useState(5);
  const [anxietyAfter, setAnxietyAfter] = useState(5);
  const [selfWorthAfter, setSelfWorthAfter] = useState(5);
  const [physicalSymptoms, setPhysicalSymptoms] = useState([]);
  const [communicationRespected, setCommunicationRespected] = useState(false);
  const [boundariesRespected, setBoundariesRespected] = useState(false);
  const [triggersAvoided, setTriggersAvoided] = useState(false);
  const [valuesAligned, setValuesAligned] = useState(false);
  const [dealBreakersPresent, setDealBreakersPresent] = useState(false);

  const symptomOptions = ['Headache', 'Tension', 'Fatigue', 'Nausea', 'Racing Heart'];

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Pre-Interaction State</Text>
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Energy Level: {energyBefore}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                value={energyBefore}
                onValueChange={setEnergyBefore}
                step={1}
                minimumTrackTintColor="#3B82F6"
                maximumTrackTintColor="#E5E7EB"
              />
            </View>
            {/* Similar sliders for anxiety and self-worth */}
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Post-Interaction Impact</Text>
            {/* Similar sliders for after values */}
            <Text style={styles.sectionTitle}>Physical Symptoms</Text>
            {symptomOptions.map(symptom => (
              <TouchableOpacity
                key={symptom}
                style={[styles.option, physicalSymptoms.includes(symptom) && styles.selectedOption]}
                onPress={() => {
                  setPhysicalSymptoms(prev => 
                    prev.includes(symptom) 
                      ? prev.filter(s => s !== symptom)
                      : [...prev, symptom]
                  );
                }}
              >
                <Text style={styles.optionText}>{symptom}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Baseline Alignment Check</Text>
            <TouchableOpacity
              style={[styles.checkOption, communicationRespected && styles.selectedCheck]}
              onPress={() => setCommunicationRespected(!communicationRespected)}
            >
              <Text style={styles.checkText}>
                ✓ Communication style respected
              </Text>
            </TouchableOpacity>
            {/* Similar checks for boundaries, triggers, values, deal-breakers */}
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressBar}>
        {[1, 2, 3].map(i => (
          <View key={i} style={[styles.progressDot, step >= i && styles.activeDot]} />
        ))}
      </View>
      
      {renderStep()}

      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => {
            if (step < 3) {
              setStep(step + 1);
            } else {
              // Save interaction data and navigate back
              navigation.goBack();
            }
          }}
        >
          <Text style={styles.nextText}>{step === 3 ? 'Complete' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
```

### 3. Relationship Health Dashboard Screen
Shows automatic compatibility analysis based on CIT data vs baseline.

```typescript
// HealthDashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const HealthDashboardScreen = ({ route }) => {
  const { relationshipId } = route.params;
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    calculateHealthScore();
  }, []);

  const calculateHealthScore = () => {
    // Get stored CIT interactions for this relationship
    // Get stored baseline data
    // Calculate compatibility percentages
    
    const mockData = {
      overallScore: 78,
      communicationRespected: 85,
      boundariesRespected: 90,
      triggersAvoided: 70,
      valuesAligned: 80,
      avgEnergyChange: 1.2,
      avgSelfWorthChange: 0.8,
      totalInteractions: 12,
      dealBreakers: 0
    };
    
    setHealthData(mockData);
  };

  if (!healthData) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.mainScore}>{healthData.overallScore}%</Text>
        <Text style={styles.scoreLabel}>Baseline Compatibility</Text>
        <Text style={styles.interactionCount}>
          Based on {healthData.totalInteractions} interactions
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Communication Respected</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${healthData.communicationRespected}%` }]} />
          </View>
          <Text style={styles.metricValue}>{healthData.communicationRespected}%</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Boundaries Respected</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${healthData.boundariesRespected}%`, backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.metricValue}>{healthData.boundariesRespected}%</Text>
        </View>

        {/* Similar rows for other metrics */}
        
        <View style={styles.impactRow}>
          <Text style={styles.metricLabel}>Average Energy Impact</Text>
          <Text style={[styles.impactValue, { color: healthData.avgEnergyChange > 0 ? '#10B981' : '#EF4444' }]}>
            {healthData.avgEnergyChange > 0 ? '+' : ''}{healthData.avgEnergyChange.toFixed(1)}
          </Text>
        </View>
      </View>

      {healthData.dealBreakers > 0 && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>⚠️ Deal-breakers Present</Text>
          <Text style={styles.alertText}>
            Found in {healthData.dealBreakers} of {healthData.totalInteractions} interactions
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scoreContainer: { 
    alignItems: 'center', 
    padding: 30,
    backgroundColor: '#F9FAFB'
  },
  mainScore: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    color: '#3B82F6' 
  },
  scoreLabel: { 
    fontSize: 18, 
    color: '#374151', 
    marginTop: 8 
  },
  interactionCount: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginTop: 4 
  },
  metricsContainer: { padding: 20 },
  metricRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  metricLabel: { 
    flex: 1, 
    fontSize: 16, 
    color: '#374151' 
  },
  progressBarContainer: { 
    width: 60, 
    height: 8, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 4, 
    marginHorizontal: 10 
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: '#3B82F6', 
    borderRadius: 4 
  },
  metricValue: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#374151', 
    width: 40 
  },
  impactRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  impactValue: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  alertContainer: { 
    margin: 20, 
    padding: 15, 
    backgroundColor: '#FEF2F2', 
    borderColor: '#FECACA', 
    borderWidth: 1, 
    borderRadius: 8 
  },
  alertTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#991B1B' 
  },
  alertText: { 
    fontSize: 14, 
    color: '#7F1D1D', 
    marginTop: 4 
  }
});
```

### 4. Navigation Structure
```typescript
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Relationships" component={RelationshipsScreen} />
      <Tab.Screen name="Tracker" component={TrackerMenuScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="BaselineSetup" 
          component={PersonalBaselineScreen}
          options={{ title: 'Personal Baseline' }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="InteractionTracker" 
          component={InteractionTrackerScreen}
          options={{ title: 'Interaction Tracker' }}
        />
        <Stack.Screen 
          name="HealthDashboard" 
          component={HealthDashboardScreen}
          options={{ title: 'Relationship Health' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## CRITICAL REQUIREMENTS

1. **NO MANUAL FLAG ENTRY** - All relationship analysis comes from CIT data compared to baseline
2. **AUTOMATIC PATTERN RECOGNITION** - App calculates health scores, doesn't let users input "red flags"
3. **BASELINE-CENTRIC** - Everything is compared against user's established needs
4. **HEALTH SCORING ALGORITHM** - Use the exact formula provided
5. **COLOR SCHEME** - Use exact colors specified (#3B82F6, #10B981, #EF4444, etc.)
6. **DATA PERSISTENCE** - Store baseline and CIT data locally with AsyncStorage

## Package.json Dependencies
```json
{
  "dependencies": {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/stack": "^6.0.0",
    "@react-navigation/bottom-tabs": "^6.0.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "react-native-screens": "^3.22.0",
    "react-native-safe-area-context": "^4.6.3"
  }
}
```

BUILD EXACTLY THIS STRUCTURE. Do not deviate from these designs, colors, or functionality.