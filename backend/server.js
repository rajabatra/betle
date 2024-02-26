//we will need pm2 to keep server running if it dies

const express = require("express");
const schedule = require('node-schedule');
const mysql = require("mysql2")
const cors = require("cors");
const {updatePicksAndStreaks } = require('./resetTeamPicks');
const { generateAndInsertGame } = require('./scraper');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());


const db = require('./config/dbconfig');
const authRoutes = require('./routes/authRoutes');


app.use('/', authRoutes);


//schedule for updating the reset picks
const rule = new schedule.RecurrenceRule();
rule.hour = 6;
rule.minute = 19;
rule.tz = 'Etc/UTC';

schedule.scheduleJob(rule, async function(){
    console.log('Scheduled reset of team picks');
    updatePicksAndStreaks();
  });

//schedule for calling the scraper
const rule2 = new schedule.RecurrenceRule();
rule2.hour = 4;
rule2.minute = 47;
rule2.tz = 'Etc/UTC';

schedule.scheduleJob(rule2, async function(){
    console.log('Scheduled task to generate and insert game');
    try {
        await generateAndInsertGame();
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
  });

  //endpoint to get leaderboard from Json

  app.get('/getTopUsers', (req, res) => {
    const fs = require('fs');

    fs.readFile('topUsers.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the top users file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json({ success: true, topUsers: JSON.parse(data) });
    });
    
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

schedule.scheduleJob(userStatsRule, function() {
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
  



app.listen(8081, ()=> {
    console.log("listening")
})
