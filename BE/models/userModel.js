const db = require('../config/db');

const createUser = (user, callback) => {
  const { name, email, password } = user;
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [name, email, password], function (err) {
    callback(err, { id: this?.lastID });
  });
};

const getUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ? AND isDeleted = 0`;
  db.get(sql, [email], (err, row) => {
    callback(err, row);
  });
};

module.exports = { createUser, getUserByEmail };
