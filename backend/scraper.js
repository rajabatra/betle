const sports = ['nba', 'basketball', 'football', 'baseball'];
const apiEndpoints = {
    nba: 'https://v2.nba.api-sports.io',
    basketball: 'https://v1.basketball.api-sports.io',
    football: 'https://v3.football.api-sports.io',
    baseball: 'https://v1.baseball.api-sports.io'
};

async function getRandomGame() {
    let selectedSport = selectRandomSport();
    let gameData = await fetchGameData(selectedSport);

    while (!gameData) {
        selectedSport = selectRandomSport();
        gameData = await fetchGameData(selectedSport);
    }

    return gameData;
}

function selectRandomSport() {
    const randomIndex = Math.floor(Math.random() * sports.length);
    return sports[randomIndex];
}

async function fetchGameData(sport) {
    const apiUrl = apiEndpoints[sport];
    const today = new Date().toISOString().split('T')[0];
    const url = `${apiUrl}/games?date=${today}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Your API key should be added here
                'x-apisports-key': '4ad171719b632dfd4faf8774291732a7'
            }
        });

        const data = await response.json();
        if (data && data.results.length > 0) {
            const randomGameIndex = Math.floor(Math.random() * data.results.length);
            const game = data.results[randomGameIndex];
            return {
                gameId: game.gameId,
                teams: game.teams,
                time: game.time,
                api: apiUrl
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

getRandomGame().then(gameData => console.log(gameData));