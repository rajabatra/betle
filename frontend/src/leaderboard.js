import React from 'react';
import './leaderboard.css'; // Assuming you've added the provided CSS here




function Leaderboard({ topUsers, onClose }) {
  //top 5 users from json
    const topFiveUsers = topUsers
    .sort((a, b) => b.points - a.points) // Assuming you have a 'points' field
    .slice(0, 5);


   //share function
   const handleShareClick = () => {
    const leaderboardText = topFiveUsers
      .map((user, index) => `${index + 1}. ${user.username} - ${user.winning_streak} points`)
      .join('\n');
    
    // Prefix and suffix messages can be customized
    const shareMessage = `🏆 Leaderboard 🏆\n\n${leaderboardText}\n\nCheck out the leaderboard!`;

    navigator.clipboard.writeText(shareMessage)
      .then(() => {
        alert('Leaderboard copied to clipboard!'); // Feedback to the user
      })
      .catch(err => {
        console.error('Failed to copy leaderboard to clipboard', err);
        alert('Oops! Could not copy to clipboard.');
      });
  }; 
  return (
    <div className="leaderboard-wrapper">
    <main>
      <div id="header">
        <h1>Top Streaks</h1>
        <button className="share" onClick={handleShareClick}>
        📋
         
        </button>
      </div>
      <div id="leaderboard">
        <div className="ribbon"></div>
        <table>
          {topFiveUsers.map((user, index) => (
            <tr key={user.id}>
              <td className="number">{index + 1}</td>
              <td className="name">{user.username}</td>
              <td className="points">
                {user.winning_streak} <span>&nbsp;days</span>
                
              </td>
            </tr>
          ))}
        </table>
        <div id="buttons">
          <button className="exit" onClick={onClose}>Exit</button>
        </div>
      </div>
    </main>
  </div>
  );
}

export default Leaderboard;

