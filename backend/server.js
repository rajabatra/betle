//we will need pm2 to keep server running if it dies

const express = require("express");
const schedule = require("node-schedule");
const mysql = require("mysql2");
const cors = require("cors");
const { updatePicksAndStreaks } = require("./resetTeamPicks");
const { generateAndInsertGame } = require("./scraper");
const { createDB } = require("./createDatabase");

// RESOURCES
// express app
const app = express();
app.use(cors());
app.use(express.json());

// database
const db = createDB();

// ROUTES
app.post("/signup", (req, res) => {
  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  const insertSql = "INSERT INTO users (username, email, password) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];

  db.query(checkEmailSql, [req.body.email], (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (data.length > 0) {
      return res
        .status(409)
        .json({ error: "This email is already being used" });
    } else {
      db.query(insertSql, [values], (insertErr, insertData) => {
        if (insertErr) {
          return res.status(500).json({ error: insertErr.message });
        }
        return res.json({ success: true, data: insertData });
      });
    }
  });
});

const jwt = require("jsonwebtoken");
const JWT_SECRET = "your-very-secure-and-secret-key";

app.post("/login", (req, res) => {
  const sql =
    "SELECT id, username, winning_streak, current_team_pick  FROM users WHERE email = ? AND password = ?";

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (data.length > 0) {
      // Successfully logged in
      const user = data[0];
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
      );

      return res.json({ success: true, token: token, user: data[0] });
      //return res.json({ success: true, user: data[0] });
    } else {
      // Login failed
      return res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};



// Route to get user data
app.get('/getUserData', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT username, winning_streak, current_team_pick, right_count, wrong_count FROM users WHERE id = ?";

  db.query(sql, [userId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (data.length > 0) {
      return res.json({ success: true, userData: data[0] });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});

app.post("/updateTeamPick", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const teamPick = req.body.teamPick;

  const sql = "UPDATE users SET current_team_pick = ? WHERE id = ?";
  db.query(sql, [teamPick, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({
      success: true,
      message: "Team pick updated successfully",
    });
  });
});

//schedule for updating the reset picks
const rule = new schedule.RecurrenceRule();
rule.hour = 4;
rule.minute = 3;
rule.tz = 'Etc/UTC';

schedule.scheduleJob(rule, async function () {
  console.log("Scheduled reset of team picks");
  updatePicksAndStreaks();
});

//schedule for calling the scraper
const rule2 = new schedule.RecurrenceRule();
rule2.hour = 3;
rule2.minute = 6;
rule2.tz = 'Etc/UTC';

schedule.scheduleJob(rule2, async function () {
  console.log("Scheduled task to generate and insert game");
  try {
    await generateAndInsertGame();
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
});

//endpoint to get today's game
app.get('/getTodaysGame', (req, res) => {
  const fs = require('fs');

  fs.readFile('gameForToday.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading todays game file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json({ success: true, gameForToday: JSON.parse(data) });
  });

});

//endpoint to get current pick percentages
app.get('/getLivePicks', (req, res) => {
  const fs = require('fs');

  fs.readFile('userStats.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading live stats file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json({ success: true, gameForToday: JSON.parse(data) });
  });

});

//write today's stats
const userStatsRule = new schedule.RecurrenceRule();
userStatsRule.hour = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
userStatsRule.minute = 1;

schedule.scheduleJob(userStatsRule, function () {
  const fs = require('fs');
  const query = "SELECT current_team_pick, COUNT(*) AS count FROM users WHERE current_team_pick IN (1, 2) GROUP BY current_team_pick";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Failed to query database:', err);
      return;
    }

    const stats = { team1: 0, team2: 0 };
    results.forEach(row => {
      if (row.current_team_pick === 1) {
        stats.team1 = row.count;
      } else if (row.current_team_pick === 2) {
        stats.team2 = row.count;
      }
    });

    fs.writeFile('userStats.json', JSON.stringify(stats), (err) => {
      if (err) {
        console.error('Failed to write to file:', err);
      } else {
        console.log('User stats updated successfully');
      }
    });
  });
});


//TODO: put in database not in file
app.get("/getTopUsers", (req, res) => {
  const fs = require("fs");

  fs.readFile("topUsers.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the top users file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json({ success: true, topUsers: JSON.parse(data) });
  });
});

app.get("/", (req, res) => {
  res.json({ success: true });
});

server = app.listen(8081, () => {
  console.log("listening");
});

function gracefulShutdown() {
  console.log("Shutting down betl backend gracefully...");
  server.close();
  process.exit(0);
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
