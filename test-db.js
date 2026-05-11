const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'db.hbmalsfhpjysrmjrkwao.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Prabhat.m@123',
  ssl: { rejectUnauthorized: false }
});

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const result = await pool.query(
      'INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, email, name, role',
      ['test-user-123', 'test@example.com', hashedPassword, 'Test User', 'user']
    );
    
    console.log('User created successfully!');
    console.log('User details:', result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      console.log('User already exists!');
    } else {
      console.error('Error:', e.message);
    }
  } finally {
    await pool.end();
  }
}

createTestUser();