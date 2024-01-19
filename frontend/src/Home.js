import React from 'react';
import { useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();
  const username = location.state?.username || 'Guest';

  return (
    <div>Welcome, {username}</div>
  );
}

export default Home;