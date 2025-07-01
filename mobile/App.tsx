import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const queryClient = new QueryClient();

// Simple API configuration
const API_BASE_URL = 'https://your-replit-url.replit.dev'; // Replace with your actual URL

function DashboardScreen() {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BoundarySpace</Text>
        <Text style={styles.headerSubtitle}>Your personal boundary tracker</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>0</Text>
            <Text style={styles.statLabel}>Respected</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>0</Text>
            <Text style={styles.statLabel}>Challenged</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#3B82F6' }]}>
          <Text style={styles.buttonText}>Log Boundary Experience</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#EC4899' }]}>
          <Text style={styles.buttonText}>Relationship Check-in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Setup Instructions</Text>
        <Text style={styles.setupText}>
          1. Replace API_BASE_URL in App.tsx with your Replit URL{'\n'}
          2. Ensure your backend is running{'\n'}
          3. Test the connection{'\n'}
          4. Start logging your boundaries!
        </Text>
      </View>
    </ScrollView>
  );
}

function BoundariesScreen() {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boundaries</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Goals</Text>
        <Text style={styles.setupText}>
          Your boundary goals will appear here once connected to the backend.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Boundaries</Text>
        <Text style={styles.setupText}>
          Create and manage your personal boundaries through the full interface.
        </Text>
      </View>
    </ScrollView>
  );
}

function RelationshipsScreen() {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relationships</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tracked Relationships</Text>
        <Text style={styles.setupText}>
          Your relationship profiles and health scores will display here.
        </Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardScreen />;
      case 'boundaries': return <BoundariesScreen />;
      case 'relationships': return <RelationshipsScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          
          {renderScreen()}

          {/* Simple Tab Navigation */}
          <View style={styles.tabBar}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
              onPress={() => setActiveTab('dashboard')}
            >
              <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
                Dashboard
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'boundaries' && styles.activeTab]}
              onPress={() => setActiveTab('boundaries')}
            >
              <Text style={[styles.tabText, activeTab === 'boundaries' && styles.activeTabText]}>
                Boundaries
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'relationships' && styles.activeTab]}
              onPress={() => setActiveTab('relationships')}
            >
              <Text style={[styles.tabText, activeTab === 'relationships' && styles.activeTabText]}>
                Relationships
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  screen: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  setupText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});
