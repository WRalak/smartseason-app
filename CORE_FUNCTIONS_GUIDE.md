# SmartSeason Core Functions Guide

## **Field Agent Core Functions** (`agentCore.js`)

### **1. Update the stage of a field**
```javascript
import { agentCore } from './api/agentCore';

// Update field stage with notes
await agentCore.updateFieldStage(fieldId, 'growing', 'Field is progressing well');

// Or update stage without notes
await agentCore.updateFieldStage(fieldId, 'ready');
```

### **2. Add notes or observations**
```javascript
// Add notes with optional stage update
await agentCore.addFieldObservation(fieldId, 'Excellent crop quality observed', 'ready');

// Add notes without changing stage
await agentCore.addFieldObservation(fieldId, 'No pest issues this week');
```

### **Helper Functions**
```javascript
// Get my assigned fields
const myFields = await agentCore.getMyFields();

// Get field details to see current stage
const fieldDetails = await agentCore.getFieldDetails(fieldId);
```

---

## **Admin Core Functions** (`adminCore.js`)

### **1. View all fields**
```javascript
import { adminCore } from './api/adminCore';

// Get all fields in the system
const allFields = await adminCore.getAllFields();
```

### **2. Monitor updates across agents**
```javascript
// Get all updates from all agents
const allUpdates = await adminCore.getAllUpdates();

// Monitor specific agent's updates
const agentUpdates = await adminCore.getAgentUpdates(agentId);

// Get all agents for monitoring
const allAgents = await adminCore.getAllAgents();
```

---

## **React Hooks Usage**

### **Field Agent Hook** (`useAgentCore.js`)
```javascript
import { useAgentCore } from './hooks/useAgentCore';

function AgentDashboard() {
  const {
    myFields,           // My assigned fields
    loading,
    error,
    updateFieldStage,   // Update field stage
    addFieldObservation, // Add notes
    getFieldDetails,    // Get field details
    refresh
  } = useAgentCore();

  // Update field with notes
  const handleUpdate = async (fieldId) => {
    const result = await updateFieldStage(fieldId, 'ready', 'Field ready for harvest');
    if (result.success) {
      console.log('Field updated successfully!');
    }
  };

  // Add observation
  const handleAddObservation = async (fieldId) => {
    const result = await addFieldObservation(fieldId, 'No pest issues observed');
    if (result.success) {
      console.log('Observation added successfully!');
    }
  };

  return (
    <div>
      {/* Your agent dashboard */}
    </div>
  );
}
```

### **Admin Hook** (`useAdminCore.js`)
```javascript
import { useAdminCore } from './hooks/useAdminCore';

function AdminDashboard() {
  const {
    allFields,        // All fields in system
    allUpdates,       // All updates from agents
    allAgents,        // All agents
    loading,
    error,
    getAgentUpdates,  // Monitor specific agent
    refresh
  } = useAdminCore();

  return (
    <div>
      <h2>All Fields ({allFields.length})</h2>
      <h2>Recent Updates ({allUpdates.length})</h2>
      <h2>Active Agents ({allAgents.length})</h2>
    </div>
  );
}
```

---

## **Usage Examples**

### **Field Agent Workflow**
```javascript
// 1. Get my fields
const myFields = await agentCore.getMyFields();

// 2. Update field stage
await agentCore.updateFieldStage(1, 'growing', 'Good growth observed');

// 3. Add observation
await agentCore.addFieldObservation(1, 'Soil moisture is optimal');

// 4. Check field details
const details = await agentCore.getFieldDetails(1);
```

### **Admin Monitoring Workflow**
```javascript
// 1. View all fields
const allFields = await adminCore.getAllFields();

// 2. Monitor all updates
const allUpdates = await adminCore.getAllUpdates();

// 3. Check specific agent activity
const agentUpdates = await adminCore.getAgentUpdates(2);

// 4. Get agent list
const agents = await adminCore.getAllAgents();
```

---

## **Key Features**

### **Field Agent Functions**
- **Security**: Can only update assigned fields
- **Validation**: Backend enforces permissions
- **Notes**: Rich observation support
- **Stage Progression**: Validated stage transitions

### **Admin Functions**
- **Visibility**: Complete system access
- **Monitoring**: Cross-agent activity tracking
- **Updates**: Chronological update history
- **Agents**: Complete agent management view

---

## **Error Handling**

Both services return standardized responses:

```javascript
// Success
{ success: true, data: result }

// Error
{ success: false, error: "Error message" }
```

Common errors:
- **Unauthorized**: Trying to access unassigned field (agent)
- **Forbidden**: Admin-only operation (agent)
- **Not Found**: Field doesn't exist
- **Validation**: Invalid stage transition

---

## **Security Model**

### **Field Agent Restrictions**
- Can only view assigned fields
- Can only update assigned fields
- Cannot delete fields
- Cannot manage other agents

### **Admin Privileges**
- Can view all fields
- Can monitor all agent activity
- Can manage all system resources
- Full system oversight

---

## **Result: Minimal, Focused Functions**

The core functions provide exactly what you need:

**Field Agents**: Update stages + Add notes
**Admins**: View all fields + Monitor updates

No extra features, no confusion - just the essential functionality!
