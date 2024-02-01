/* This file has 3 functions. First, it checks if the users had the correct pick
and then updates their streak. After, it resets their current pick to null
finally, it updates the leaderboard */

const mysql = require("mysql2/promise");
const dayjs = require("dayjs");
const fs = require("fs").promises;

// Database connection configuration
const db = mysql.createPool({
  host: "g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "ajezug5c2jtz5d4z",
  password: "n34zb61zk2yfdhlm",
  database: "c1gr4bjdqxa06vz0",
});

// Function to update user picks and streaks
const updatePicksAndStreaks = async () => {
  try {
    console.log("Starting update");

    // Calculate yesterday's date
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    // SQL to get yesterday's game winner
    const getWinnerSql = "SELECT winner FROM games WHERE game_date = ?";
    const [gameResults] = await db.query(getWinnerSql, [yesterday]);

    if (gameResults.length > 0) {
      const winner = gameResults[0].winner;

      // SQL to update user streaks
      const updateStreakSql = `
                UPDATE users
                SET winning_streak = CASE
                    WHEN current_team_pick = ? OR ? IN (3, NULL) THEN winning_streak + 1
                    ELSE 0
                END
            `;
      await db.query(updateStreakSql, [winner, winner]);

      console.log("User streaks updated successfully");

      // Resetting team picks
      await resetTeamPicks();
      await writeTopUsersToJson();
    } else {
      console.log("No game results found for yesterday");
    }
  } catch (err) {
    console.error("Error in updatePicksAndStreaks: ", err.message);
  }
};

// Function to reset team picks
const resetTeamPicks = async () => {
  try {
    console.log("Starting Reset");
    const resetTeamPickSql = "UPDATE users SET current_team_pick = NULL";
    await db.query(resetTeamPickSql);
    console.log("Team picks reset successfully");
  } catch (err) {
    console.error("Error resetting team picks: ", err.message);
  }
};

// Function to write leaderboard to a JSON file
const writeTopUsersToJson = async () => {
  try {
    const getTopUsersSql = `
            SELECT id, username, winning_streak 
            FROM users 
            ORDER BY winning_streak DESC, id 
            LIMIT 10
        `;
    const [topUsers] = await db.query(getTopUsersSql);

    await fs.writeFile("topUsers.json", JSON.stringify(topUsers, null, 2));
    console.log("Top users written to JSON file successfully");
  } catch (err) {
    console.error("Error in writeTopUsersToJson: ", err.message);
  }
};

module.exports = { updatePicksAndStreaks };
