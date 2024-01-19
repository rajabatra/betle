const express = require("express");
const mysql = require("mysql2")
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
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
app.post('/login', (req, res) => {
    const sql = "SELECT id, username FROM users WHERE email = ? AND password = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            // Successfully logged in
            return res.json({ success: true, user: data[0] });
        } else {
            // Login failed
            return res.status(401).json({ error: "Invalid email or password" });
        }
    })
})

app.listen(8081, ()=> {
    console.log("listening")
})
