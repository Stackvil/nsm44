const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

async function initializeDatabase() {
  if (db) return db;

  const dbPath = path.resolve(__dirname, '../../nsm_db.sqlite');

  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('Connected to SQLite database: nsm_db.sqlite');

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    // Create Tables
    await createTables();

    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

async function createTables() {
  // Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'rep_admin', 'user')),
      is_verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // OTP Verification Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS otp_verification (
      email TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      expires_at DATETIME NOT NULL
    );
  `);

  // Events Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      image_url TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by) REFERENCES users(id)
    );
  `);

  console.log('Database tables initialized.');
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDatabase
};
