import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeLayout from './HomeLayout';

const Home = () => {
    const [userData, setUserData] = useState({ username: '', streak: 0, currentTeamPick: '' });
    const [teamPick, setTeamPick] = useState('');
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
                        currentTeamPick: response.data.userData.current_team_pick || ''
                    });
                    setTeamPick(response.data.userData.current_team_pick || '');
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                navigate('/');
            });
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

    const isSubmitDisabled = () => {
        const now = new Date();
        const pstTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
        const hours = pstTime.getHours();

        // Disable submit button between 4 PM PST (16) and 1 AM PST (1)
        return hours >= 16 || hours < 1;
    };

    const todayDate = new Date().toLocaleDateString();

    return (
        <HomeLayout 
            userData={userData}
            handleTeamSelect={handleTeamSelect}
            handleTeamSubmit={handleTeamSubmit}
            isSubmitDisabled={isSubmitDisabled()}
            handleSignOut={handleSignOut}
            teamPick={teamPick}
            todayDate={todayDate}
        />
    );
};

export default Home;