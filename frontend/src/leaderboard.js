import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './leaderboard.css'; // Ensure this is correctly pointing to your CSS file

function Leaderboard({ topUsers, onClose }) {
  const topFiveUsers = topUsers.sort((a, b) => b.winning_streak - a.winning_streak).slice(0, 5);

  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard-container container">
      <button className="btn btn-danger" onClick={onClose}>Close</button>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 class="headert">Top 5 Active Streaks</h2>
          
        </div>
        <div className="list-container">
        
          {topFiveUsers.map((user, index) => (
            <div key={user.id} className="user-row d-flex align-items-center justify-content-between">
              <div className="rank">#{index + 1}</div>
              <div className="username">Username: {user.username}</div>
              <div className="streak">Streak: {user.winning_streak}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;