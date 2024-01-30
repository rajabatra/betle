//import fetch from 'node-fetch';
const fetch = require('node-fetch')
const mysql = require("mysql2");


const db = mysql.createConnection({
    host: "g84t6zfpijzwx08q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ajezug5c2jtz5d4z",
    password: "n34zb61zk2yfdhlm",
    database: "c1gr4bjdqxa06vz0"
});





const leagues = [
    'https://v1.american-football.api-sports.io',
    'https://v2.nba.api-sports.io',
    'https://v1.baseball.api-sports.io',
    'https://v3.football.api-sports.io'
];

function getLeague() {
    return leagues[Math.floor(Math.random() * leagues.length)];
}

async function checkGames(leagueUrl, date) {
    let url = leagueUrl.includes('football') ?
        `${leagueUrl}/fixtures?date=${date}` :
        `${leagueUrl}/games?date=${date}`;

    const headers = {
        'x-rapidapi-key': 'a77cce330b5d21ba94ad6b1e642cb8bf',
        'x-rapidapi-host': leagueUrl
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        console.log('tested ' + leagueUrl);
        return data.results !== 0;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function convertToPST(utcDateString) {
    // Note: This is a basic conversion. Consider using libraries like moment.js for more accurate conversions
    const utcDate = new Date(utcDateString + ' UTC');
    return new Date(utcDate.getTime() - (8 * 60 * 60 * 1000)).toISOString();
}

async function generateGame() {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 2);
    const gameDate = tomorrowDate.toISOString().split('T')[0];
    let i = 0;
    let leagueChoice = leagues[i];
    let gameFound = await checkGames(leagueChoice, gameDate);

    while (!gameFound && i < leagues.length) {
        i++;
        leagueChoice = leagues[i];
        gameFound = await checkGames(leagueChoice, gameDate);
    }

    if (!gameFound) {
        console.log('No games found');
        return;
    }

    // Construct the URL
    let url = leagueChoice.includes('football') ?
        `${leagueChoice}/fixtures?date=${gameDate}` :
        `${leagueChoice}/games?date=${gameDate}`;

    const headers = {
        'x-rapidapi-key': 'a77cce330b5d21ba94ad6b1e642cb8bf',
        'x-rapidapi-host': leagueChoice
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        const responseJson = data.response;

        let gameChoicesJson = [];
        if (leagueChoice === 'https://v1.american-football.api-sports.io') {
            gameChoicesJson = responseJson.filter(x => parseInt(x.game.date.time[1]) <= 4);
        } else if (leagueChoice === 'https://v2.nba.api-sports.io') {
            gameChoicesJson = responseJson.filter(x => parseInt(x.date.start[12]) <= 4);
        } else if (leagueChoice === 'https://v1.baseball.api-sports.io') {
            gameChoicesJson = responseJson.filter(x => parseInt(x.time[1]) <= 4);
        } else if (leagueChoice === 'https://v3.football.api-sports.io') {
            gameChoicesJson = responseJson.filter(x => parseInt(x.fixture.date[12]) <= 4);
        }

        if (gameChoicesJson.length === 0) {
            console.log('No suitable games found');
            return;
        }

        const gameJson = gameChoicesJson[Math.floor(Math.random() * gameChoicesJson.length)];

        let gameInfo = {};
        if (leagueChoice === 'https://v1.american-football.api-sports.io') {
            gameInfo = {
                id: gameJson.game.id,
                date: gameJson.game.date.date,
                home_team: gameJson.teams.home.name,
                away_team: gameJson.teams.away.name
            };
        } else if (leagueChoice === 'https://v2.nba.api-sports.io') {
            gameInfo = {
                id: gameJson.id,
                date: gameJson.date.start,
                home_team: gameJson.teams.home.name,
                away_team: gameJson.teams.visitors.name
            };
        }
        // ... handle other leagues ...

        return gameInfo;
    } catch (error) {
        console.error(error);
    }
}

async function insertGameToDb(gameInfo) {
    if (!gameInfo) {
        console.log('No game info provided');
        return;
    }
    
    try {
        const query = `INSERT INTO games (id, game_date, team1, team2, team1logo) VALUES (?, ?, ?, ?, ?)`;
        const values = [gameInfo.id, gameInfo.date, gameInfo.home_team, gameInfo.away_team, gameInfo.away_team];
        await db.execute(query, values);
        console.log('Game info inserted into database successfully');
    } catch (error) {
        console.error('Failed to insert game info into database', error);
        // Optionally re-throw the error or handle it as needed
    }
}


async function generateAndInsertGame() {
    const gameInfo = await generateGame();
    if (gameInfo) {
        await insertGameToDb(gameInfo);
    } else {
        console.log('No game generated');
    }
}

module.exports = { generateAndInsertGame }