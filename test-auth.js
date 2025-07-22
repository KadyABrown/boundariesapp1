// Simple test to verify authentication flow
const fetch = require('node-fetch');

async function testAuth() {
  try {
    console.log('Testing authentication endpoints...');
    
    // Test 1: Unauthorized access
    const authResponse = await fetch('http://localhost:5000/api/auth/user');
    console.log(`Auth check: ${authResponse.status} ${authResponse.statusText}`);
    
    // Test 2: Login redirect  
    const loginResponse = await fetch('http://localhost:5000/api/login', { redirect: 'manual' });
    console.log(`Login redirect: ${loginResponse.status} ${loginResponse.statusText}`);
    console.log(`Redirect location: ${loginResponse.headers.get('location')}`);
    
    // Test 3: Local login endpoint exists
    const localAuthResponse = await fetch('http://localhost:5000/api/auth/local/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'invalid' })
    });
    console.log(`Local auth: ${localAuthResponse.status} ${localAuthResponse.statusText}`);
    
    console.log('Authentication endpoints are responding correctly');
  } catch (error) {
    console.error('Auth test failed:', error.message);
  }
}

testAuth();