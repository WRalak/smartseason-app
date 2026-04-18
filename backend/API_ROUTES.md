# SmartSeason API Routes Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication Routes (`/api/auth`)

### POST `/api/auth/login`
Login user and receive JWT token
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: { id, name, email, role } }`
- **Access**: Public

### POST `/api/auth/register-agent` (Admin Only)
Create a new field agent
- **Body**: `{ name: string, email: string, password: string }`
- **Response**: `{ id, name, email, role, created_at }`
- **Access**: Admin only

### GET `/api/auth/agents` (Admin Only)
Get all agents with field counts
- **Response**: `[{ id, name, email, field_count, status, created_at }]`
- **Access**: Admin only

## Field Management Routes (`/api/fields`) 
*All routes require authentication*

### GET `/api/fields`
Get fields based on user role
- **Admin Response**: All fields with agent names
- **Agent Response**: Only assigned fields
- **Response**: `[{ id, name, crop_type, planting_date, current_stage, assigned_agent_id, agent_name, computed_status }]`

### GET `/api/fields/:id`
Get single field with update history
- **Response**: `{ field_data, updates: [{ id, agent_id, agent_name, previous_stage, new_stage, notes, created_at }] }`
- **Access**: Admin or assigned agent

### POST `/api/fields` (Admin Only)
Create new field
- **Body**: `{ name, crop_type, planting_date, current_stage, assigned_agent_id }`
- **Response**: `{ id, name, crop_type, planting_date, current_stage, assigned_agent_id, computed_status }`
- **Access**: Admin only

### PUT `/api/fields/:id` (Admin Only)
Update field information
- **Body**: `{ name, crop_type, planting_date, current_stage, assigned_agent_id }`
- **Response**: Updated field data
- **Access**: Admin only

### DELETE `/api/fields/:id` (Admin Only)
Delete field and related updates
- **Response**: `{ message: "Field deleted successfully" }`
- **Access**: Admin only

### GET `/api/fields/agents/list` (Admin Only)
Get list of agents for field assignment
- **Response**: `[{ id, name, email }]`
- **Access**: Admin only

## Field Update Routes (`/api/updates`)
*All routes require authentication*

### POST `/api/updates`
Update field stage with notes
- **Body**: `{ field_id, new_stage, notes }`
- **Response**: Updated field data with new computed status
- **Access**: Admin or assigned agent

## Field Stages
```
planted -> growing -> ready -> harvested
```

## Field Status Logic
```
- Active: Normal progression within expected timeframes
- At Risk: Stage duration exceeds limits (planted > 30d, growing > 60d, ready > 90d)
- Completed: Harvested stage
```

## User Roles
```
- admin: Full system access, can manage all fields and agents
- agent: Can only view and update assigned fields
```

## Error Responses
```json
{
  "error": "Error message"
}
```

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```
