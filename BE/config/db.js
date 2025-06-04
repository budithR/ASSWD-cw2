const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'), (err) => {
  if (err) console.error('SQLite DB connection error:', err);
  else console.log('Connected to SQLite DB');
});

// Initialize user table with soft delete support
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    numberOfPosts INTEGER DEFAULT 0,
    createdDate TEXT DEFAULT CURRENT_TIMESTAMP,
    followers TEXT DEFAULT '[]',
    following TEXT DEFAULT '[]',
    isDeleted INTEGER DEFAULT 0
  )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      commentID INTEGER PRIMARY KEY AUTOINCREMENT,
      postID INTEGER,
      text TEXT,
      travellerID INTEGER,
      travellerName TEXT,
      addedDate TEXT
    )
`);
  

module.exports = db;
