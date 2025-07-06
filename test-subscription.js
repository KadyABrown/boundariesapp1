// Simple test to verify subscription flow works
const fetch = require('node-fetch');

async function testSubscriptionFlow() {
  const baseUrl = 'http://localhost:5000';
  
  console.log("Testing subscription flow...");
  
  try {
    // First create a checkout session
    console.log("1. Creating checkout session...");
    const checkoutResponse = await fetch(`${baseUrl}/api/subscription/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const checkoutData = await checkoutResponse.json();
    console.log("Checkout response:", checkoutData);
    
    if (checkoutData.checkoutUrl) {
      console.log("✓ Checkout session created successfully");
      console.log("Checkout URL:", checkoutData.checkoutUrl);
      
      // Extract session ID from URL for testing
      const sessionId = checkoutData.checkoutUrl.split('session_id=')[1]?.split('&')[0];
      if (sessionId) {
        console.log("Session ID:", sessionId);
        
        // NOTE: In real flow, user would complete payment here
        // For testing, we'll try to verify with this session ID
        // (This will fail because payment wasn't completed, but we can see the flow)
        
        console.log("\n2. Testing verification (will fail due to no payment)...");
        const verifyResponse = await fetch(`${baseUrl}/api/subscription/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId: sessionId })
        });
        
        const verifyData = await verifyResponse.json();
        console.log("Verify response:", verifyData);
      }
    } else {
      console.log("❌ Failed to create checkout session");
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testSubscriptionFlow();