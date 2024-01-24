const express = require("express");
const mysql = require("mysql2")
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ajezug5c2jtz5d4z",
    password: "n34zb61zk2yfdhlm",
    database: "c1gr4bjdqxa06vz0"
})

app.post('/signup', (req, res) => {
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    const insertSql = "INSERT INTO users (username, email, password) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.password];

    db.query(checkEmailSql, [req.body.email], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (data.length > 0) {
            return res.status(409).json({ error: "This email is already being used" });
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

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-very-secure-and-secret-key';

app.post('/login', (req, res) => {
    const sql = "SELECT id, username FROM users WHERE email = ? AND password = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            // Successfully logged in
            const user = data[0];
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });

            return res.json({ success: true, token: token, user: data[0]});
            //return res.json({ success: true, user: data[0] });
        } else {
            // Login failed
            return res.status(401).json({ error: "Invalid email or password" });
        }
    })
})

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
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
    const sql = "SELECT username, winning_streak FROM users WHERE id = ?";
    console.log(userId)
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


app.listen(8081, ()=> {
    console.log("listening")
})
