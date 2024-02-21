import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeLayout from './HomeLayout';

const Home = () => {
    const [userData, setUserData] = useState({ username: '', streak: 0, currentTeamPick: '', correct: 0, incorrect: 0 });
    const [teamPick, setTeamPick] = useState('');
    const [topUsers, setTopUsers] = useState({}); // New state for top users
    const [todaysGame, setTodaysGame] = useState({}); 
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
            return;
        }

        axios.get('http://localhost:8081/getUserData', { headers: { Authorization: `Bearer ${authToken}` } })
            .then(response => {
                if (response.data.success) {
                    setUserData({
                        username: response.data.userData.username,
                        winningStreak: response.data.userData.winning_streak,
                        correct: response.data.userData.right_count,
                        incorrect: response.data.userData.wrong_count,
                        currentTeamPick: response.data.userData.current_team_pick || ''
                    });
                    setTeamPick(response.data.userData.current_team_pick || '');
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                navigate('/');
            });
            // Fetch top users
        axios.get('http://localhost:8081/getTopUsers')
        .then(response => {
            if (response.data.success) {
                setTopUsers(response.data.topUsers);
            }
        })
        .catch(error => console.error('Error fetching top users:', error));

    // Fetch today's game
        axios.get('http://localhost:8081/getTodaysGame')
            .then(response => {
                if (response.data.success) {
                    setTodaysGame(response.data.gameForToday); // Ensure this matches the actual key returned by your API
                }
            })
            .catch(error => console.error('Error fetching today\'s game:', error));
        }, [navigate]);

    const handleTeamSelect = (team) => {
        setTeamPick(team);
    };

    const handleTeamSubmit = () => {
        const authToken = localStorage.getItem('authToken');
        axios.post('http://localhost:8081/updateTeamPick', { teamPick }, { 
            headers: { Authorization: `Bearer ${authToken}` } 
        })
        .then(response => {
            if (response.data.success) {
                setUserData({ ...userData, currentTeamPick: teamPick });
                console.log('Team updated successfully');
            }
        })
        .catch(error => {
            console.error('Error updating team pick:', error);
        });
    };

    const handleSignOut = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };
    //check to see if it is time where button should be disabled
    const isSubmitDisabled = () => {
        const now = new Date();
        const pstTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
        const hours = pstTime.getHours();

        // Disable submit button between 4 PM PST (16) and 1 AM PST (1)
        return hours >= 16 || hours < 1;
    };

    const todayDate = new Date().toLocaleDateString();

    //const currentTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    return (
        <HomeLayout 
            userData={userData}
            handleTeamSelect={handleTeamSelect}
            handleTeamSubmit={handleTeamSubmit}
            isSubmitDisabled={isSubmitDisabled()}
            handleSignOut={handleSignOut}
            teamPick={teamPick}
            topUsers={topUsers}
            todaysGame={todaysGame}
            todayDate={todayDate}
        />
    );
};

export default Home;