import React from 'react';

const HomeLayout = ({ userData, handleTeamSelect, handleTeamSubmit, handleSignOut, teamPick, todayDate, isSubmitDisabled  }) => {
    const currentTeamText = userData.currentTeamPick ? `Your current selection: ${userData.currentTeamPick}` : 'No selection has been made';

    return (
        <div>
            <h1>Welcome, {userData.username}</h1>
            <p>Today's Date: {todayDate}</p>
            <p>Your Current Streak: {userData.winningStreak}</p>
            <button onClick={() => handleTeamSelect(1)}>Team 1</button>
            <button onClick={() => handleTeamSelect(2)}>Team 2</button>
            <p>{currentTeamText}</p>
            {teamPick && <button onClick={handleTeamSubmit} disabled={isSubmitDisabled}>Submit Team</button>}
         
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    )
};

export default HomeLayout;