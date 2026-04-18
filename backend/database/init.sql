-- Create database
CREATE DATABASE smartseason;

\c smartseason;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'agent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fields table
CREATE TABLE fields (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    planting_date DATE NOT NULL,
    current_stage VARCHAR(50) NOT NULL CHECK (current_stage IN ('planted', 'growing', 'ready', 'harvested')),
    assigned_agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Field updates table
CREATE TABLE field_updates (
    id SERIAL PRIMARY KEY,
    field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE,
    agent_id INTEGER REFERENCES users(id),
    previous_stage VARCHAR(50),
    new_stage VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users
-- Password for both: password123
INSERT INTO users (email, password_hash, name, role) VALUES 
('admin@smartseason.com', '$2a$10$rQKp5xJZqL9qL9qL9qL9quO9qL9qL9qL9qL9qL9qL9qL9qL9qL9q', 'Admin User', 'admin'),
('agent1@smartseason.com', '$2a$10$rQKp5xJZqL9qL9qL9qL9quO9qL9qL9qL9qL9qL9qL9qL9qL9qL9q', 'John Agent', 'agent'),
('agent2@smartseason.com', '$2a$10$rQKp5xJZqL9qL9qL9qL9quO9qL9qL9qL9qL9qL9qL9qL9qL9qL9q', 'Jane Agent', 'agent');

-- Insert sample fields
INSERT INTO fields (name, crop_type, planting_date, current_stage, assigned_agent_id, created_by) VALUES
('North Field', 'Corn', '2024-03-15', 'growing', 2, 1),
('South Field', 'Wheat', '2024-04-01', 'planted', 2, 1),
('East Field', 'Soybeans', '2024-02-20', 'ready', 3, 1),
('West Field', 'Corn', '2024-03-25', 'growing', 3, 1);