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
    const sql = "INSERT INTO users (username, email, password) VALUES (?)"
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: err.message });
            //return res.json("Error");
        }
        return res.json({ success: true, data: data });
        //return res.json(data);
    })
})

app.listen(8081, ()=> {
    console.log("listening")
})
