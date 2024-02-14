import React, { useState } from 'react';
import './HomeLayout.css'; 
import './teamcard.css';
import './infobox.css';

const HomeLayout = ({ userData, handleTeamSelect, handleTeamSubmit, handleSignOut, teamPick, todayDate, isSubmitDisabled, todaysGame, topUsers }) => {
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

    const toggleLeaderboard = () => setIsLeaderboardOpen(!isLeaderboardOpen);

    const currentTeamText = userData.currentTeamPick ? `${userData.currentTeamPick}` : 'No selection has been made';
  
    const team1logo = todaysGame['team1logo']
    const team2logo = todaysGame['team2logo']
    const team1name = todaysGame['team1']
    const team2name = todaysGame['team2']
    const gameTime = todaysGame['game_time']
    //test
    const [selectedTeam, setSelectedTeam] = useState(null);

    const selectTeam = (teamNumber) => {
        setSelectedTeam(teamNumber); // Update the selected team
        handleTeamSelect(teamNumber); // Call existing handleTeamSelect with the selected team
    };
    //test


    return (
        <div className="home-layout">
            <nav className="navbar">
                <div className="logo"><img src="logo.jpeg" /></div>
                <div className="nav-icons">
                    <button className="icon-button">?</button>
                    <button className="icon-button" onClick={toggleLeaderboard}>🎖️</button>
                    <button className="icon-button" onClick={handleSignOut}>Sign Out</button>
                </div>
            </nav>

            {isLeaderboardOpen && (
                <div className="leaderboard-popup">
                    <div className="leaderboard-content">
                        <h2>Leaderboard</h2>
                        <p>{JSON.stringify(topUsers)}</p>
                        <button onClick={toggleLeaderboard}>Close</button>
                    </div>
                </div>
            )}
            <div className="container">
            <div className="box">
            <div class="text-box">
                    <div class="text-content">
                        <h2 class="name">{userData.username}</h2>
                        <p class="number">Your Current Streak: {userData.winningStreak}</p>
                        
                    </div>
                </div>
            </div>
            
            

            <div className="grid">
                <div className={`team ${selectedTeam === 1 ? 'team-selected' : ''}`} onClick={() => selectTeam(1)}>
                        <img src={todaysGame['team1logo']} alt="Team 1" />
                        <div className="team-name">{team1name}</div>
                </div>
                    <div className={`team ${selectedTeam === 2 ? 'team-selected' : ''}`} onClick={() => selectTeam(2)}>
                        <img src={todaysGame['team2logo']} alt="Team 2" />
                        <div className="team-name">{team2name}</div>
                    </div>
            </div>
            {teamPick && <button onClick={handleTeamSubmit} className="submit-btn" disabled={isSubmitDisabled}>Submit Team</button>}
            
            <div className="box">
            <div class="text-box">
                    <div class="text-content">
                        <p class="day">Your Current Pick: {currentTeamText}</p>
                        <p class="day">Game Time: {todayDate} at {gameTime} PST</p>
                        <p class="day">Picks Lock At: 16:00 PST</p>
                    </div>
                </div>
            </div>
        </div>

            {/* <div className="content">
                <h1>Welcome, {userData.username}</h1>
                <p>Today's Date: {todayDate}</p>
                <p>Your Current Streak: {userData.winningStreak}</p>
                <p>Todays game: {JSON.stringify(todaysGame)}</p>
                <p>Todays leaders: {JSON.stringify(topUsers)}</p>
                <button onClick={() => handleTeamSelect(1)}>Team 1</button>
                <button onClick={() => handleTeamSelect(2)}>Team 2</button>
                <p>{currentTeamText}</p>
                
                
             
                
            </div> */}
        </div>
    );
};

export default HomeLayout;