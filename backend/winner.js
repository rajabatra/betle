const leagues = [
    'https://v1.american-football.api-sports.io',
    'https://v2.nba.api-sports.io',
    'https://v1.baseball.api-sports.io',
    'https://v3.football.api-sports.io'
];

async function determineWinner(home_score, away_score) {
    if (home_score === away_score) {
        return 0; // Tie
    } else if (home_score > away_score) {
        return 1; // Home team wins
    } else {
        return 2; // Away team wins
    }
}

async function checkWinner(leagueUrl, game_id) {
    let url = leagueUrl.includes('https://v3.football.api-sports.io') 
            ? `${leagueUrl}/fixtures?id=${game_id}` 
            : `${leagueUrl}/games?id=${game_id}`;

    const headers = {
        'x-rapidapi-key': 'a77cce330b5d21ba94ad6b1e642cb8bf',
        'x-rapidapi-host': leagueUrl.replace('https://', '')
    };

    const response = await fetch(url, { headers: headers });
    const responseJson = await response.json();
    const gameJson = responseJson.response[0];
    let result = 0;
    // console.log(gameJson);
    try {
        switch (leagueUrl) {
            case 'https://v1.american-football.api-sports.io':
                result = determineWinner(gameJson.scores.home.total, gameJson.scores.away.total);
                break;
            case 'https://v2.nba.api-sports.io':
                result = determineWinner(gameJson.scores.home.points, gameJson.scores.visitors.points); 
                break;
            case 'https://v1.baseball.api-sports.io':
                result = determineWinner(gameJson.scores.home.total, gameJson.scores.away.total);
                break;
            case 'https://v3.football.api-sports.io':
                result = determineWinner(gameJson.goals.home, gameJson.goals.away);
                break;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        result = 3;
    }
 
    return result;
}

module.exports = { checkWinner }