// Browser test for CRUD functionality
console.log('=== Testing CRUD in Browser ===');

// Test if we can access the API
fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'agent1@smartseason.com',
    'password': 'password123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Login successful:', data);
  
  // Test agent CRUD
  const token = data.token;
  
  // Test get fields
  return fetch('http://localhost:4000/api/fields', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(fields => {
    console.log('Agent fields:', fields.length);
    
    if (fields.length > 0) {
      const field = fields[0];
      console.log('Testing field update...');
      
      // Test update
      return fetch('http://localhost:4000/api/updates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          field_id: field.id,
          new_stage: 'ready',
          notes: 'Browser test update'
        })
      })
      .then(response => response.json())
      .then(updateResult => {
        console.log('Update successful:', updateResult);
      });
    }
  });
})
.catch(error => {
  console.error('Test failed:', error.message);
});
