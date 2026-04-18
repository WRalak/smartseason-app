// Demo of separated role-based functions
import { agentService, adminService } from './index';

// Field Agent Function Demo
export const demoAgentFunctions = async () => {
  console.log('=== Field Agent Functions Demo ===');
  
  try {
    // 1. Get assigned fields
    console.log('1. Getting assigned fields...');
    const assignedFields = await agentService.getAssignedFields();
    console.log(`Found ${assignedFields.length} assigned fields`);
    
    // 2. Get agent statistics
    console.log('2. Getting agent statistics...');
    const stats = await agentService.getAgentStats();
    console.log('Agent stats:', stats);
    
    // 3. Update field stage with notes
    if (assignedFields.length > 0) {
      const field = assignedFields[0];
      console.log('3. Updating field stage...');
      
      const updateResult = await agentService.updateFieldStage(field.id, {
        newStage: 'ready',
        notes: 'Field is ready for harvest. Quality is excellent.'
      });
      
      console.log('Update successful:', updateResult.current_stage);
    }
    
    // 4. Get personal update history
    console.log('4. Getting personal update history...');
    const myUpdates = await agentService.getMyUpdateHistory();
    console.log(`Found ${myUpdates.length} personal updates`);
    
    console.log('=== Agent Functions Demo Complete ===');
    
  } catch (error) {
    console.error('Agent demo error:', error);
  }
};

// Admin Function Demo
export const demoAdminFunctions = async () => {
  console.log('=== Admin Functions Demo ===');
  
  try {
    // 1. View all fields
    console.log('1. Getting all fields...');
    const allFields = await adminService.getAllFields();
    console.log(`Found ${allFields.length} total fields`);
    
    // 2. Get dashboard statistics
    console.log('2. Getting dashboard statistics...');
    const dashboardStats = await adminService.getDashboardStats();
    console.log('Dashboard stats:', dashboardStats);
    
    // 3. Monitor updates across agents
    console.log('3. Getting all updates...');
    const allUpdates = await adminService.getAllUpdates();
    console.log(`Found ${allUpdates.length} total updates`);
    
    // 4. Get agent metrics
    console.log('4. Getting agent metrics...');
    const agentMetrics = await adminService.getAgentMetrics();
    console.log('Agent metrics:', agentMetrics);
    
    // 5. Get recent activity
    console.log('5. Getting recent activity...');
    const recentActivity = await adminService.getAgentActivity('7d');
    console.log(`Found ${recentActivity.length} recent activities`);
    
    // 6. Create new agent (demo only)
    console.log('6. Creating new agent...');
    const newAgent = await adminService.createAgent({
      name: 'Demo Agent',
      email: 'demo@smartseason.com',
      password: 'password123'
    });
    console.log('New agent created:', newAgent.name);
    
    // 7. Create new field
    console.log('7. Creating new field...');
    const newField = await adminService.createField({
      name: 'Demo Field',
      crop_type: 'Corn',
      planting_date: '2024-04-15',
      current_stage: 'planted',
      assigned_agent_id: newAgent.id
    });
    console.log('New field created:', newField.name);
    
    // 8. Generate report
    console.log('8. Generating agent report...');
    const report = await adminService.generateAgentReport();
    console.log('Report generated with', report.agents.length, 'agents');
    
    console.log('=== Admin Functions Demo Complete ===');
    
  } catch (error) {
    console.error('Admin demo error:', error);
  }
};

// Usage example
export const runRoleDemos = async () => {
  // First run as agent
  await demoAgentFunctions();
  
  // Then run as admin
  await demoAdminFunctions();
};

// Export for easy testing
export default {
  demoAgentFunctions,
  demoAdminFunctions,
  runRoleDemos
};
