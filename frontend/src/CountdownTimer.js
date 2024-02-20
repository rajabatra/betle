// CountdownTimer.js
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import './CountdownTimer.css';

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState('');
    const [message, setMessage] = useState('');

    const calculateTimeLeft = () => {
        const now = moment().tz('America/Los_Angeles');
        let targetTime;
        let message;

        // After 4 PM or before 1 AM, count down to 1 AM (meaning picks open after 1 AM)
        if (now.hour() >= 16 || now.hour() < 1) {
            targetTime = now.clone().startOf('day').add(1, 'days').hour(1); // Next day 1 AM
            message = "Picks Unlock In:";
        } else {
            // After 1 AM and before 4 PM, count down to 4 PM (meaning picks lock at 4 PM)
            targetTime = now.clone().startOf('day').hour(16); // Same day 4 PM
            message = "Picks Lock In:";
        }

        const duration = moment.duration(targetTime.diff(now));
        const formattedDuration = `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
        return { timeLeft: formattedDuration, message };
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const { timeLeft, message } = calculateTimeLeft();
            setTimeLeft(timeLeft);
            setMessage(message);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="countdown-timer">
            <p>{message} {timeLeft}</p>
        </div>
    );
};


export default CountdownTimer;