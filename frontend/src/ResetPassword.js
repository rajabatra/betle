
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Function to validate the password
    const validatePassword = (password) => {
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        return password.length >= 8 && hasNumber && hasLetter;
    };

    // Function to extract the token from the URL query parameters
    const getTokenFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return params.get('token');
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long and contain at least one number and one letter.');
            return;
        }

        const token = getTokenFromUrl();
        if (!token) {
            alert('Token is missing.');
            return;
        }

        // Your existing fetch logic here
        fetch(`http://localhost:8081/resetPassword?token=${encodeURIComponent(token)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Password has been reset successfully.');
                navigate('/login'); // Redirect to login page
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div>
            <div className="logo"><img src="betl.jpg" /></div>
            <h2>Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">New Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (!validatePassword(e.target.value)) {
                            setPasswordError('Password must be at least 8 characters long and contain at least one number and one letter.');
                        } else {
                            setPasswordError('');
                        }
                    }}
                    required
                />
                {passwordError && <div style={{color: 'red'}}>{passwordError}</div>}
                <button type="submit" disabled={!validatePassword(password)}>Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;