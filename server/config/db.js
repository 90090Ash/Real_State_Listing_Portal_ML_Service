const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'real_estate_db',
  password: process.env.PG_PASSWORD || 'your_postgres_password', // Replace with your actual password
  port: process.env.PG_PORT || 5432,
});

pool.on('connect', () => {
  console.log('⚡ Connected to PostgreSQL / PostGIS Database');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};