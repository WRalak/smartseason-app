# SmartSeason API Testing Guide

## Setup
1. Start the backend server: `node server.js`
2. Run the test script: `node api-test.js`

## Test Scenarios

### 1. Authentication Tests
```javascript
// Login as Admin
POST /api/auth/login
{
  "email": "admin@smartseason.com",
  "password": "password123"
}

// Create New Agent (Admin Only)
POST /api/auth/register-agent
{
  "name": "Test Agent",
  "email": "testagent@smartseason.com", 
  "password": "password123"
}

// Get All Agents (Admin Only)
GET /api/auth/agents

// Get Agents List for Field Assignment (Admin Only)
GET /api/fields/agents/list
```

### 2. Field Management Tests
```javascript
// Get All Fields (Admin sees all, Agent sees assigned only)
GET /api/fields

// Get Single Field Details
GET /api/fields/1

// Create New Field (Admin Only)
POST /api/fields
{
  "name": "Test Field",
  "crop_type": "Corn",
  "planting_date": "2024-04-01",
  "current_stage": "planted",
  "assigned_agent_id": 2
}

// Update Field (Admin Only)
PUT /api/fields/1
{
  "name": "Updated Field",
  "crop_type": "Wheat",
  "planting_date": "2024-04-01",
  "current_stage": "growing",
  "assigned_agent_id": 3
}

// Delete Field (Admin Only)
DELETE /api/fields/1
```

### 3. Field Update Tests
```javascript
// Create Field Update (Admin or Assigned Agent)
POST /api/updates
{
  "field_id": 1,
  "new_stage": "growing",
  "notes": "Field is growing well, good progress observed"
}
```

## Expected Responses

### Success Responses
- **200 OK**: Successful GET/PUT/DELETE
- **201 Created**: Successful POST
- **Data Format**: JSON with proper structure

### Error Responses
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server error

## Frontend Integration

### Using the API Services
```javascript
import { apiService } from './api';

// Login
const result = await apiService.auth.login(email, password);

// Get dashboard data
const dashboardData = await apiService.dashboard.getData();

// Create field
const newField = await apiService.fields.create(fieldData);

// Create update
const update = await apiService.updates.create(updateData);
```

### Using React Hooks
```javascript
import { useDashboard, useAuth, useFields } from './hooks';

// Dashboard hook
const { fields, agents, stats, loading, refresh } = useDashboard();

// Auth hook
const { user, login, logout } = useAuth();

// Fields hook
const { fields, createField, updateField, deleteField } = useFields();
```

## Authentication Flow

1. **Login**: Get JWT token
2. **Set Header**: `Authorization: Bearer <token>`
3. **Make Requests**: Include token in all API calls
4. **Handle Errors**: Check for 401/403 responses

## Role-Based Access

### Admin Permissions
- View all fields
- Create, update, delete fields
- Create, view agents
- View all updates

### Agent Permissions
- View only assigned fields
- Update field stages and notes
- View own update history

## Data Models

### User
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@smartseason.com",
  "role": "admin"
}
```

### Field
```json
{
  "id": 1,
  "name": "North Field",
  "crop_type": "Corn",
  "planting_date": "2024-03-15",
  "current_stage": "growing",
  "assigned_agent_id": 2,
  "agent_name": "John Agent",
  "computed_status": "active",
  "created_at": "2024-03-15T10:00:00Z",
  "updated_at": "2024-04-01T15:30:00Z"
}
```

### Field Update
```json
{
  "id": 1,
  "field_id": 1,
  "agent_id": 2,
  "agent_name": "John Agent",
  "previous_stage": "planted",
  "new_stage": "growing",
  "notes": "Good growth observed",
  "created_at": "2024-04-01T15:30:00Z"
}
```

## Status Computation Logic

### Active Field
- Normal progression within expected timeframes
- Planted: < 30 days
- Growing: < 60 days  
- Ready: < 90 days

### At Risk Field
- Stage duration exceeds thresholds
- Requires attention

### Completed Field
- Stage is "harvested"

## Testing Checklist

- [ ] Admin can login
- [ ] Agent can login
- [ ] Admin can create agents
- [ ] Admin can view all agents
- [ ] Admin can create fields
- [ ] Admin can update fields
- [ ] Admin can delete fields
- [ ] Agent can view only assigned fields
- [ ] Agent can update field stages
- [ ] Agent can add notes
- [ ] Update history is preserved
- [ ] Field status is computed correctly
- [ ] Authentication works properly
- [ ] Authorization is enforced
