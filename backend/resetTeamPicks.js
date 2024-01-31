const mysql = require("mysql2");

// Database connection configuration
const db = mysql.createPool({
    host: "g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ajezug5c2jtz5d4z",
    password: "n34zb61zk2yfdhlm",
    database: "c1gr4bjdqxa06vz0"
});

// Function to reset team picks
const resetTeamPicks = () => {
    console.log("Starting Reset");
    const resetTeamPickSql = "UPDATE users SET current_team_pick = NULL";
    db.query(resetTeamPickSql, (err, result) => {
        if (err) {
            console.error("Error resetting team picks: ", err.message);
            return;
        }
        console.log("Team picks reset successfully");
    });
};

module.exports = resetTeamPicks;