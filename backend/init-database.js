import { Pool } from 'pg';

// Connect to the smartseason database
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '2587',
  database: 'smartseason',
});

async function initializeDatabase() {
  try {
    console.log('Initializing database tables...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'agent')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created');

    // Create fields table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fields (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        crop_type VARCHAR(100) NOT NULL,
        planting_date DATE NOT NULL,
        current_stage VARCHAR(50) NOT NULL CHECK (current_stage IN ('planted', 'growing', 'ready', 'harvested')),
        assigned_agent_id INTEGER REFERENCES users(id),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Fields table created');

    // Create field_updates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS field_updates (
        id SERIAL PRIMARY KEY,
        field_id INTEGER NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
        agent_id INTEGER REFERENCES users(id),
        previous_stage VARCHAR(50),
        new_stage VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Field updates table created');

    // Check if we have users and insert sample data if needed
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('Inserting sample data...');
      
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('password123', 10);

      // Insert users
      await pool.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)',
        [
          'admin@smartseason.com', hashedPassword, 'Admin User', 'admin',
          'agent1@smartseason.com', hashedPassword, 'John Agent', 'agent',
          'agent2@smartseason.com', hashedPassword, 'Jane Agent', 'agent'
        ]
      );

      // Get user IDs
      const adminResult = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@smartseason.com']);
      const agent1Result = await pool.query('SELECT id FROM users WHERE email = $1', ['agent1@smartseason.com']);
      const agent2Result = await pool.query('SELECT id FROM users WHERE email = $1', ['agent2@smartseason.com']);

      const adminId = adminResult.rows[0].id;
      const agent1Id = agent1Result.rows[0].id;
      const agent2Id = agent2Result.rows[0].id;

      // Insert sample fields
      await pool.query(`
        INSERT INTO fields (name, crop_type, planting_date, current_stage, assigned_agent_id, created_by) VALUES
        ('North Field', 'Corn', '2024-03-15', 'growing', $1, $2),
        ('South Field', 'Wheat', '2024-04-01', 'planted', $1, $2),
        ('East Field', 'Soybeans', '2024-02-20', 'ready', $3, $2),
        ('West Field', 'Corn', '2024-03-25', 'growing', $3, $2)
      `, [agent1Id, adminId, agent2Id]);

      console.log('Sample data inserted successfully');
    }

    console.log('Database initialization complete!');
    
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
