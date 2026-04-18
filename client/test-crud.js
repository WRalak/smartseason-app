// Test CRUD functionality
import { agentCore } from './api/agentCore';
import { adminCore } from './api/adminCore';

// Test agent CRUD
async function testAgentCRUD() {
  console.log('=== Testing Agent CRUD ===');
  
  try {
    // Test get fields
    console.log('1. Getting agent fields...');
    const fields = await agentCore.getMyFields();
    console.log(`Found ${fields.length} fields`);
    
    if (fields.length > 0) {
      const field = fields[0];
      console.log('Testing with field:', field.name);
      
      // Test update field stage
      console.log('2. Updating field stage...');
      const updateResult = await agentCore.updateFieldStage(
        field.id, 
        'ready', 
        'Agent test update - field looks ready'
      );
      console.log('Update result:', updateResult);
      
      // Test add observation
      console.log('3. Adding observation...');
      const obsResult = await agentCore.addFieldObservation(
        field.id, 
        'Agent observation - no issues observed'
      );
      console.log('Observation result:', obsResult);
      
      // Test get field details
      console.log('4. Getting field details...');
      const details = await agentCore.getFieldDetails(field.id);
      console.log('Field details:', details);
    }
    
    console.log('Agent CRUD test completed successfully!');
    
  } catch (error) {
    console.error('Agent CRUD test failed:', error.message);
  }
}

// Test admin CRUD
async function testAdminCRUD() {
  console.log('=== Testing Admin CRUD ===');
  
  try {
    // Test get all fields
    console.log('1. Getting all fields...');
    const fields = await adminCore.getAllFields();
    console.log(`Found ${fields.length} fields`);
    
    // Test get all updates
    console.log('2. Getting all updates...');
    const updates = await adminCore.getAllUpdates();
    console.log(`Found ${updates.length} updates`);
    
    // Test get all agents
    console.log('3. Getting all agents...');
    const agents = await adminCore.getAllAgents();
    console.log(`Found ${agents.length} agents`);
    
    console.log('Admin CRUD test completed successfully!');
    
  } catch (error) {
    console.error('Admin CRUD test failed:', error.message);
  }
}

// Run tests
testAgentCRUD();
testAdminCRUD();
