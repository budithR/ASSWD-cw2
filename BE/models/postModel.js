const db = require('../config/db');

db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    postID INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    country TEXT,
    travellerId INTEGER,
    travellerName TEXT,
    Likes TEXT DEFAULT '[]',
    Dislikes TEXT DEFAULT '[]',
    Comments TEXT DEFAULT '[]',
    createdDate TEXT DEFAULT CURRENT_TIMESTAMP,
    visitedDate TEXT,
    allDetails TEXT,
    IsDeleted INTEGER DEFAULT 0,
    FOREIGN KEY (travellerId) REFERENCES users(id)
  )
`);

const insertPost = (post, callback) => {
  const {
    title,
    description,
    country,
    travellerId,
    travellerName,
    visitedDate,
    allDetails
  } = post;

  const sql = `
    INSERT INTO posts (
      title, description, country, travellerId, travellerName,
      visitedDate, allDetails
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [title, description, country, travellerId, travellerName, visitedDate, allDetails],
    function (err) {
      callback(err, { postID: this?.lastID });
    }
  );
};

module.exports = { insertPost };
