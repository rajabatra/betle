import React, { useState } from 'react';
import './HomeLayout.css'; 
import './teamcard.css';
import './infobox.css';
import './iconbutton.css';
import Questionpopup from './questionpopup';
import './graphs.css';
import CountdownTimer from './CountdownTimer';
import './CountdownTimer.css';
import './streak.css';
import ChartToggle from './charttoggle';
import Leaderboard from './leaderboard';

const HomeLayout = ({ userData, handleTeamSelect, handleTeamSubmit, handleSignOut, teamPick, todayDate, isSubmitDisabled, todaysGame, topUsers }) => {
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleLeaderboard = () => setIsLeaderboardOpen(!isLeaderboardOpen);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

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
                    <button className="button-56" role="button" onClick={toggleModal}>?</button>
                    <button className="button-56" role="button" onClick={toggleLeaderboard}>🏁</button>
                    <button className="button-56" role="button" onClick={handleSignOut}>↪</button>
                </div>
            </nav>
            <Questionpopup isOpen={isModalOpen} onClose={toggleModal} githubLink="https://github.com/yourusername"/>
            {isLeaderboardOpen && <Leaderboard topUsers={topUsers} onClose={toggleLeaderboard}/>}
            <div className="container">
            <div className="box">
            <div class="text-box">
                    <div class="text-content">
                        
                        <p class="ptext"> <span class="fancy">{userData.winningStreak} Day Streak</span>
                        
                        </p>
                        
                    </div>
                </div>
            </div>
            
            
            <div className="gamebox">
                <div>
                
               <p class = "ptext2">
               <span class="cfancy">Today's Game: </span>
                
               
                
                </p>
                
              
            
            <div className="grid">
            
                <div className={`team ${selectedTeam === 1 ? 'team-selected' : ''}`} onClick={() => selectTeam(1)}>
                        
                    <div className="team-content">
                         <div className="team-name">Home</div>
                        <img src={todaysGame['team1logo']} alt="Team 1" />
                        <div className="team-name">{team1name}</div>
                    </div>
                       
                </div>
                    <div className={`team ${selectedTeam === 2 ? 'team-selected' : ''}`} onClick={() => selectTeam(2)}>
                    <div className="team-content">
                        <div className="team-name">Away</div>
                        <img src={todaysGame['team2logo']} alt="Team 2" />
                        <div className="team-name">{team2name}</div>
                     </div>
                        
                    </div>
                    </div>
                    <p class = "ptext3">
                    Your Current Selection: {currentTeamText === '1' ? todaysGame['team1'] : currentTeamText === '2' ? todaysGame['team2'] : currentTeamText}
                    </p>
                    {teamPick && <button onClick={handleTeamSubmit} className="submit-btn" disabled={isSubmitDisabled}>Submit Pick</button>}
            </div>
            </div>
            <div class="chartbox">
                <p class="ptext">Stats</p>
            <div className="box"><ChartToggle userdata={userData}/></div>
            <div className="stats-container">
  <div className="stat-item">
    <span className="stat-label">Username:</span>
    <span className="stat-value">{userData.username}</span>
  </div>
  <hr className="divider"/>
  <div className="stat-item">
    <span className="stat-label">Total games played:</span>
    <span className="stat-value">{userData.correct + userData.incorrect}</span>
  </div>
  <hr className="divider"/>
  <div className="stat-item">
    <span className="stat-label">Percent Correct:</span>
    <span className="stat-value">{((userData.correct / (userData.correct + userData.incorrect)) * 100).toFixed(2)}%</span>
  </div>
</div>
            </div>
            
            
           
            
            
        </div>

           {/* Footer */}
        <div className="footer">
        
            <CountdownTimer /> {/* This renders the countdown timer */}
        </div>
        </div>
    );
};

export default HomeLayout;