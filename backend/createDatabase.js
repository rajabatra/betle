const mysql = require("mysql2");


function createDB() {
  const connection = process.env.LOCAL_DB ? mysql.createPool({
    host: 'db',
    user: 'root',
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
  }) : mysql.createConnection({
    host: "g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ajezug5c2jtz5d4z", // replace with your MySQL username
    password: "n34zb61zk2yfdhlm", // replace with your MySQL password
  });

  connection.execute(`
          CREATE TABLE IF NOT EXISTS games (
            id INT AUTO_INCREMENT PRIMARY KEY,
            gameid VARCHAR(255) NOT NULL,
            game_date DATE NOT NULL,
            sport VARCHAR(50) NOT NULL,
            team1 VARCHAR(255) NOT NULL,
            team2 VARCHAR(255) NOT NULL,
            team1logo TEXT NOT NULL,
            team2logo TEXT NOT NULL,
            game_time TIME NOT NULL,
            winner VARCHAR(255),
            home_picks INT DEFAULT 0,
            away_picks INT DEFAULT 0
          )`
  );

  connection.execute(`
        CREATE TABLE IF NOT EXISTS games (
          id INT AUTO_INCREMENT PRIMARY KEY,
          gameid VARCHAR(255) NOT NULL,
          game_date DATE NOT NULL,
          sport VARCHAR(50) NOT NULL,
          team1 VARCHAR(255) NOT NULL,
          team2 VARCHAR(255) NOT NULL,
          team1logo TEXT NOT NULL,
          team2logo TEXT NOT NULL,
          game_time TIME NOT NULL,
          winner VARCHAR(255)
        )`
  );
}

module.exports = { createDB }
