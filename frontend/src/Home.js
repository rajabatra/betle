import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [userData, setUserData] = useState({ username: '', streak: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:8081/getUserData', { headers: { Authorization: `Bearer ${authToken}` } })
            .then(response => {
                if (response.data.success) {
                    setUserData(response.data.userData);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Potentially handle token expiration, etc.
            });
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const todayDate = new Date().toLocaleDateString();

    return (
        <div>
            <h1>Welcome, {userData.username}</h1>
            <p>Today's Date: {todayDate}</p>
            <p>Your Current Streak: {userData.winning_streak}</p>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default Home;