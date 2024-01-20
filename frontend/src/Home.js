import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Home = () => {
    const [game, setGame] = useState(null);

    useEffect(() => {
      axios.get('https://v1.basketball.api-sports.io/games', {
        params: { date: '2024-01-20' },
        headers: {
          'x-rapidapi-key': '4ad171719b632dfd4faf8774291732a7', // Replace with your API key
        },
      })
      .then(response => {
        const games = response.data.response;
        const randomGame = games[Math.floor(Math.random() * games.length)];
        setGame(randomGame);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
    }, []);
  
    if (!game) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h2>{game.league.name} - {game.status.long}</h2>
        <p>{game.teams.home.name} vs {game.teams.away.name}</p>
        <img src={game.teams.home.logo} alt={game.teams.home.name} />
        <img src={game.teams.away.logo} alt={game.teams.away.name} />
        {/* Other game details here */}
      </div>
    );
  
}



export default Home;