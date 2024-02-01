//we will need pm2 to keep server running if it dies

const express = require("express");
const schedule = require("node-schedule");
const mysql = require("mysql2");
const cors = require("cors");
const { updatePicksAndStreaks } = require("./resetTeamPicks");
const { generateAndInsertGame } = require("./scraper");

const app = express();
app.use(cors());
app.use(express.json());

// for local deployments
const db = process.env.LOCAL_DB
  ? mysql.createPool({
      host: "server-side",
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    })
  : mysql.createPool({
      host: "g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "ajezug5c2jtz5d4z",
      password: "n34zb61zk2yfdhlm",
      database: "c1gr4bjdqxa06vz0",
    });

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
const { env } = require("process");
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
app.get("/getUserData", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const sql =
    "SELECT username, winning_streak, current_team_pick FROM users WHERE id = ?";

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
rule.hour = 9;
rule.minute = 10;
rule.tz = "Etc/UTC";

schedule.scheduleJob(rule, async function () {
  console.log("Scheduled reset of team picks");
  updatePicksAndStreaks();
});

//schedule for calling the scraper
const rule2 = new schedule.RecurrenceRule();
rule2.hour = 9;
rule2.minute = 0;
rule2.tz = "Etc/UTC";

schedule.scheduleJob(rule2, async function () {
  console.log("Scheduled task to generate and insert game");
  try {
    await generateAndInsertGame();
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
});

//endpoint to get leaderboard from Json

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

app.listen(8081, () => {
  console.log("listening");
});
