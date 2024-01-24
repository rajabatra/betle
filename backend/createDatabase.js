const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'ajezug5c2jtz5d4z', // replace with your MySQL username
  password: 'n34zb61zk2yfdhlm', // replace with your MySQL password
});

connection.connect((err) => {
  if (err) {
    return console.error('Error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');

  // Create the 'signup' database
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS c1gr4bjdqxa06vz0`;
  connection.query(createDatabaseQuery, (err, results) => {
    if (err) throw err;
    console.log("Database 'c1gr4bjdqxa06vz0' created or already exists.");
    
    // Use the 'signup' database
    connection.changeUser({database : 'c1gr4bjdqxa06vz0'}, (err) => {
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

        // Create the 'games' table
        const createGamesTableQuery = `
          CREATE TABLE IF NOT EXISTS games (
            id INT AUTO_INCREMENT PRIMARY KEY,
            game_date DATE NOT NULL,
            sport VARCHAR(50) NOT NULL,
            team1 VARCHAR(255) NOT NULL,
            team2 VARCHAR(255) NOT NULL,
            game_time TIME NOT NULL,
            winner VARCHAR(255)
          )`;
        connection.query(createGamesTableQuery, (err, results) => {
          if (err) throw err;
          console.log("Table 'games' created or already exists.");
          connection.end();
        });
      });
    });
  });
});