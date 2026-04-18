import { Pool } from 'pg';

// Connect to default postgres database first
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '2587',
  database: 'postgres',
});

async function createDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    
    // Create the database
    await pool.query('CREATE DATABASE smartseason');
    console.log('Database smartseason created successfully');
    
    // Close connection to postgres database
    await pool.end();
    
    // Connect to the new database
    const smartseasonPool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '2587',
      database: 'smartseason',
    });

    // Read and execute the init.sql file
    const fs = await import('fs');
    const initSql = fs.readFileSync('database/init.sql', 'utf8');
    
    // Execute the SQL script
    await smartseasonPool.query(initSql);
    console.log('Database initialized with tables and sample data!');
    
    await smartseasonPool.end();
    
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database smartseason already exists, initializing tables...');
      
      // Database exists, just initialize tables
      const smartseasonPool = new Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '2587',
        database: 'smartseason',
      });

      const fs = await import('fs');
      const initSql = fs.readFileSync('database/init.sql', 'utf8');
      
      await smartseasonPool.query(initSql);
      console.log('Database initialized with tables and sample data!');
      
      await smartseasonPool.end();
    } else {
      console.error('Error:', error.message);
    }
  }
}

createDatabase();
