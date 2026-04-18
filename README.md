# SmartSeason - Field Monitoring System

A comprehensive field monitoring application for agricultural operations, enabling admins to coordinate field assignments and agents to track crop progress.

## Features

- **Role-based Authentication**: Admin and Field Agent roles with appropriate access controls
- **Field Management**: Create, edit, and assign fields to agents
- **Progress Tracking**: Update field stages with notes and history
- **Smart Status Logic**: Automated status calculation (Active/At Risk/Completed) based on planting date and growth stage
- **Dashboard**: Role-specific views with statistics and summaries
- **Update History**: Complete audit trail of all field updates

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing

### Frontend
- React 18
- Zustand for state management
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- date-fns for date handling

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smartseason-app.git
cd smartseason-app