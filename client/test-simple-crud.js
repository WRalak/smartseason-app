// Simple CRUD test
console.log('=== Simple CRUD Test ===');

// Test 1: Check if we can access the API
fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'agent1@smartseason.com',
    password: 'password123'
  })
})
.then(response => {
  console.log('Login successful!');
  console.log('User:', response.data.user);
  console.log('Token:', response.data.token.substring(0, 50) + '...');
  
  // Test 2: Get fields
  const token = response.data.token;
  return fetch('http://localhost:4000/api/fields', {
    headers: {
      'Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
})
.then(response => response.json())
.then(fields => {
  console.log('Fields found:', fields.length);
  fields.forEach((field, index) => {
    console.log(`Field ${index + 1}: ${field.name} (${field.current_stage})`);
  });
  
  // Test 3: Try update
  if (fields.length > 0) {
    const field = fields[0];
    console.log('Testing update...');
    
    return fetch('http://localhost:4000/api/updates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        field_id: field.id,
        new_stage: 'ready',
        notes: 'Simple test update'
      })
    });
  }
})
.then(response => response.json())
.then(updateResult => {
    console.log('Update successful:', updateResult);
  });
})
.catch(error => {
  console.error('Test failed:', error.message);
});
