const { db } = require('./server/db');
const { feedback } = require('./shared/schema');

async function createTestFeedback() {
  try {
    console.log('Creating test feedback entry...');
    
    // Insert a test feedback item
    const testFeedback = await db.insert(feedback).values({
      userId: 'test-user-id',
      title: 'Test Feedback - Notification Button Info',
      description: 'Testing the feedback submission flow to ensure admin can view reports properly. This is a test submission to verify the notification button information appears correctly in the In Progress section.',
      type: 'improvement',
      priority: 'medium',
      status: 'reported',
      submittedBy: 'Test User'
    }).returning();
    
    console.log('Test feedback created:', testFeedback);
    
    // Verify by fetching all feedback
    const allFeedback = await db.select().from(feedback);
    console.log('All feedback items:', allFeedback);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test feedback:', error);
    process.exit(1);
  }
}

createTestFeedback();