const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    connectionString: 'postgres://postgres:password@localhost:5432/postgres'
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE workshop_db');
    console.log('Database workshop_db created successfully');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database workshop_db already exists');
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
