const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
});

connection.connect((err) => {
  if (err) {
    return console.error('Error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');

  // Create the 'signup' database
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS signup`;
  connection.query(createDatabaseQuery, (err, results) => {
    if (err) throw err;
    console.log("Database 'signup' created or already exists.");
    
    // Use the 'signup' database
    connection.changeUser({database : 'signup'}, (err) => {
      if (err) throw err;

      // Create the 'users' table
      const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          current_team_pick INT,
          winning_streak INT DEFAULT 0
        )`;
      connection.query(createUsersTableQuery, (err, results) => {
        if (err) throw err;
        console.log("Table 'users' created or already exists.");
        connection.end();
      });
    });
  });
});