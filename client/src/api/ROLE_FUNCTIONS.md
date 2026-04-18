# SmartSeason Role-Based Functions Documentation

## Field Agent Functions (`agentService.js`)

### Core Agent Capabilities

#### **Update Field Stage**
```javascript
import { agentService } from '../api';

// Update field stage with notes
const result = await agentService.updateFieldStage(fieldId, {
  newStage: 'growing',
  notes: 'Field is progressing well, good growth observed'
});
```

**Features:**
- Validates agent can only update assigned fields
- Prevents updating harvested fields
- Ensures progressive stage transitions
- Includes detailed notes/observations
- Automatic field status computation

#### **Add Notes/Observations**
```javascript
// Notes are included in the update stage function
const result = await agentService.updateFieldStage(fieldId, {
  newStage: 'ready',
  notes: 'Field is ready for harvest. Crop quality is excellent. No pest issues observed.'
});
```

### Agent Data Management

#### **Get Assigned Fields**
```javascript
const fields = await agentService.getAssignedFields();
// Returns only fields assigned to current agent
```

#### **Get Field Details**
```javascript
const fieldDetails = await agentService.getFieldDetails(fieldId);
// Includes full update history and field information
```

#### **Get Personal Update History**
```javascript
const myUpdates = await agentService.getMyUpdateHistory();
// Returns only updates made by current agent
```

#### **Get Agent Statistics**
```javascript
const stats = await agentService.getAgentStats();
// Returns: totalFields, activeFields, atRiskFields, stageBreakdown
```

### Agent Utilities

#### **Validate Update Permissions**
```javascript
const canUpdate = agentService.canUpdateField(field, user);
// Returns true if agent can update the field
```

#### **Get Available Stages**
```javascript
const availableStages = agentService.getAvailableStages('planted');
// Returns: ['growing', 'ready', 'harvested']
```

---

## Admin Functions (`adminService.js`)

### Core Admin Capabilities

#### **View All Fields**
```javascript
import { adminService } from '../api';

const allFields = await adminService.getAllFields();
// Returns all fields in the system with full details
```

**Features:**
- Complete field visibility
- Agent assignment information
- Field status and stage data
- Update history included

#### **Monitor Updates Across Agents**
```javascript
// Get all updates from all agents
const allUpdates = await adminService.getAllUpdates();

// Get updates by specific agent
const agentUpdates = await adminService.getUpdatesByAgent(agentId);

// Get recent agent activity
const recentActivity = await adminService.getAgentActivity('7d');
```

**Features:**
- Cross-agent visibility
- Chronological activity tracking
- Performance metrics
- Agent workload monitoring

### Admin Data Management

#### **Agent Management**
```javascript
// Create new agent
const newAgent = await adminService.createAgent({
  name: 'John Smith',
  email: 'john@smartseason.com',
  password: 'password123'
});

// Get all agents
const agents = await adminService.getAllAgents();

// Get agent metrics
const metrics = await adminService.getAgentMetrics();
```

#### **Field Management**
```javascript
// Create field
const newField = await adminService.createField({
  name: 'North Field',
  crop_type: 'Corn',
  planting_date: '2024-04-01',
  current_stage: 'planted',
  assigned_agent_id: 2
});

// Update field
const updatedField = await adminService.updateField(fieldId, fieldData);

// Delete field
await adminService.deleteField(fieldId);

// Assign field to agent
await adminService.assignFieldToAgent(fieldId, agentId);
```

### Admin Analytics & Reporting

#### **Dashboard Statistics**
```javascript
const stats = await adminService.getDashboardStats();
// Returns comprehensive admin dashboard data
```

**Includes:**
- Total fields and agents
- Field status breakdown
- Stage distribution
- Agent workload metrics

#### **Agent Performance Metrics**
```javascript
const metrics = await adminService.getAgentMetrics();
// Returns performance data for each agent
```

**Includes:**
- Field count per agent
- Update frequency
- Efficiency ratings
- Last activity timestamps

#### **Activity Monitoring**
```javascript
// Get recent activity
const activity = await adminService.getAgentActivity('24h'); // 24h, 7d, 30d

// Generate comprehensive report
const report = await adminService.generateAgentReport();
```

### Bulk Operations

#### **Bulk Field Assignment**
```javascript
const assignments = [
  { fieldId: 1, agentId: 2 },
  { fieldId: 2, agentId: 3 },
  { fieldId: 3, agentId: 2 }
];

const results = await adminService.bulkAssignFields(assignments);
// Returns success/failure for each assignment
```

---

## React Hooks Integration

### Field Agent Hook (`useAgent.js`)
```javascript
import { useAgent } from '../hooks';

function AgentDashboard() {
  const {
    assignedFields,
    stats,
    loading,
    error,
    refresh,
    updateFieldStage,
    getFieldDetails,
    getMyUpdateHistory
  } = useAgent();

  // Component logic...
}
```

### Admin Hook (`useAdmin.js`)
```javascript
import { useAdmin } from '../hooks';

function AdminDashboard() {
  const {
    allFields,
    agents,
    loading,
    error,
    refresh,
    createAgent,
    createField,
    updateField,
    deleteField,
    getAllUpdates,
    getDashboardStats,
    getAgentMetrics
  } = useAdmin();

  // Component logic...
}
```

---

## Usage Examples

### Field Agent Workflow
```javascript
// 1. Get assigned fields
const fields = await agentService.getAssignedFields();

// 2. Update field with notes
await agentService.updateFieldStage(fieldId, {
  newStage: 'ready',
  notes: 'Crop is ready for harvest. Quality is excellent.'
});

// 3. View personal update history
const myUpdates = await agentService.getMyUpdateHistory();
```

### Admin Workflow
```javascript
// 1. View all fields and their status
const allFields = await adminService.getAllFields();

// 2. Monitor agent activity
const recentActivity = await adminService.getAgentActivity('7d');

// 3. Get performance metrics
const metrics = await adminService.getAgentMetrics();

// 4. Create new agent
await adminService.createAgent(agentData);

// 5. Assign field to agent
await adminService.assignFieldToAgent(fieldId, agentId);
```

---

## Security & Permissions

### Field Agent Restrictions
- Can only view assigned fields
- Can only update own assigned fields
- Cannot delete fields
- Cannot manage other agents
- Cannot view other agents' assigned fields

### Admin Privileges
- Full system visibility
- Complete CRUD operations
- Agent management
- Bulk operations
- Advanced analytics

### Data Validation
- Stage progression validation
- Permission checking
- Input sanitization
- Role-based access control

---

## Error Handling

All functions return standardized responses:
```javascript
// Success
{ success: true, data: result }

// Error
{ success: false, error: "Error message" }
```

Common error scenarios:
- Unauthorized access attempts
- Invalid stage transitions
- Missing required fields
- Network connectivity issues
