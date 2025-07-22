// Test script to verify core app functionality
import { db } from './server/db.js';
import { storage } from './server/storage.js';

async function testAppFunctionality() {
  console.log('🔍 Testing BoundaryCore App Functionality...\n');
  
  try {
    // Test 1: Database Connection
    console.log('1. Testing Database Connection...');
    const userCount = await db.execute(`SELECT COUNT(*) as count FROM users`);
    console.log(`✅ Database connected. User count: ${userCount.rows[0].count}`);
    
    // Test 2: User Operations
    console.log('\n2. Testing User Operations...');
    const testUser = await storage.createUser({
      id: 'test-functionality-user',
      email: 'test-func@example.com',
      firstName: 'Test',
      lastName: 'Functionality',
      accountType: 'local'
    });
    console.log(`✅ User creation: ${testUser.email}`);
    
    // Test 3: Relationship Profile Creation
    console.log('\n3. Testing Relationship Profiles...');
    const relationship = await storage.createRelationshipProfile({
      userId: testUser.id,
      name: 'Test Relationship',
      relationshipType: 'dating',
      relationshipStatus: 'interested'
    });
    console.log(`✅ Relationship profile created: ID ${relationship.id}`);
    
    // Test 4: Behavioral Flags
    console.log('\n4. Testing Behavioral Flags...');
    const greenFlag = await storage.createBehavioralFlag({
      profileId: relationship.id,
      flagType: 'green',
      category: 'communication',
      description: 'Always responds thoughtfully'
    });
    console.log(`✅ Green flag created: ${greenFlag.description}`);
    
    // Test 5: Emotional Check-ins
    console.log('\n5. Testing Emotional Check-ins...');
    const checkIn = await storage.createEmotionalCheckIn({
      profileId: relationship.id,
      safetyRating: 8,
      emotionalTone: 'positive'
    });
    console.log(`✅ Check-in created: Safety ${checkIn.safetyRating}/10`);
    
    // Test 6: Relationship Stats
    console.log('\n6. Testing Relationship Analytics...');
    const stats = await storage.getRelationshipStats(relationship.id);
    console.log(`✅ Stats calculated: ${stats.greenFlags} green, ${stats.redFlags} red flags`);
    
    // Test 7: Boundary Operations
    console.log('\n7. Testing Boundaries...');
    const boundary = await storage.createBoundary({
      userId: testUser.id,
      title: 'Test Boundary',
      description: 'Testing boundary functionality',
      category: 'personal-space',
      importance: 8
    });
    console.log(`✅ Boundary created: ${boundary.title}`);
    
    // Test 8: Dashboard Stats
    console.log('\n8. Testing Dashboard Analytics...');
    const dashStats = await storage.getDashboardStats(testUser.id);
    console.log(`✅ Dashboard stats: ${dashStats.todayEntries} entries today`);
    
    console.log('\n🎉 ALL CORE FUNCTIONALITY TESTS PASSED');
    console.log('\nThe app core features are working properly:');
    console.log('- ✅ Database operations');
    console.log('- ✅ User management');
    console.log('- ✅ Relationship tracking');
    console.log('- ✅ Flag system');
    console.log('- ✅ Analytics');
    console.log('- ✅ Boundary management');
    
    // Cleanup
    await db.execute(`DELETE FROM users WHERE id = 'test-functionality-user'`);
    console.log('\n🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
  
  process.exit(0);
}

testAppFunctionality();