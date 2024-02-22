const express = require('express');
const router = express.Router();
const app = express();
const db = require('../config/dbconfig');
const cors = require("cors");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

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
const JWT_SECRET = process.env.JWT_SECRET;

app.post('/login', (req, res) => {
    const sql = "SELECT id, username, winning_streak, current_team_pick  FROM users WHERE email = ? AND password = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            // Successfully logged in
            const user = data[0];
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

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

app.post('/updateTeamPick', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const teamPick = req.body.teamPick;

    const sql = "UPDATE users SET current_team_pick = ? WHERE id = ?";
    db.query(sql, [teamPick, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json({ success: true, message: 'Team pick updated successfully' });
    });
});

//forgot password routes


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "thebetlapp@gmail.com",
      pass: "ovuv nick nrcs xyew",
    },
  });
  //when u hit forgot password for email
  app.post('/forgotPassword', (req, res) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        
        return res.status(500).json({ error: err.message });
      }
      const token = buffer.toString('hex');
      const expireDate = new Date(Date.now() + 3600000); // Token expires in 1 hour
  
      db.query('UPDATE users SET passwordResetToken = ?, passwordResetExpires = ? WHERE email = ?', [token, expireDate, email], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows) {
          const mailOptions = {
            from: 'process.env.EMAIL',
            to: email,
            subject: 'Password Reset',
            html: `You requested a password reset. Please click on this <a href="http://localhost:3000/resetPassword?token=${token}">link</a> to reset your password.`
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
              return res.status(500).json({ error: error.message });
            } else {
              return res.json({ success: true, message: 'Password reset email sent.' });
            }
          });
        } else {
          return res.status(404).json({ error: "Email not found" });
        }
      });
    });
  });

  //for resetting password:
  app.post('/resetPassword', (req, res) => {
    const token = req.query.token;
    const newPassword = req.body.password;
    db.query('SELECT * FROM users WHERE passwordResetToken = ? AND passwordResetExpires > ?', [token, new Date()], (err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (users.length > 0) {
        const user = users[0];
        db.query('UPDATE users SET password = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE id = ?', [newPassword, user.id], (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.json({ success: true, message: 'Password has been reset successfully' });
        });
      } else {
        return res.status(400).json({ error: "Password reset token is invalid or has expired" });
      }
    });
  });

module.exports = app;