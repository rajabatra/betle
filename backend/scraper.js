//import fetch from 'node-fetch';
const fetch = require('node-fetch')
const mysql = require("mysql2");
const { checkWinner } = require('./winner');

const db = mysql.createPool({
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


async function checkGames(leagueUrl, date) {
    let url = leagueUrl.includes('https://v3.football.api-sports.io') 
              ? `${leagueUrl}/fixtures?date=${date}` 
              : `${leagueUrl}/games?date=${date}`;

    const headers = {
        'x-rapidapi-key': 'a77cce330b5d21ba94ad6b1e642cb8bf',
        'x-rapidapi-host': leagueUrl.replace('https://', '')
    };

    const response = await fetch(url, { headers: headers });
    const responseJson = await response.json();
    let gameChoicesJson = [];

    switch (leagueUrl) {
        case 'https://v1.american-football.api-sports.io':
            gameChoicesJson = responseJson.response.filter(x => parseInt(x.game.date.time.split(':')[0]) <= 4);
            break;
        case 'https://v2.nba.api-sports.io':
            gameChoicesJson = responseJson.response.filter(x => parseInt(x.date.start.substring(11, 13)) <= 4);
            break;
        case 'https://v1.baseball.api-sports.io':
            gameChoicesJson = responseJson.response.filter(game => game.time < "04:00");
            break;
        case 'https://v3.football.api-sports.io':
            gameChoicesJson = responseJson.response.filter(x => parseInt(x.fixture.date.substring(11, 13)) <= 4);
            break;
    }

    console.log('tested ' + leagueUrl);
    return gameChoicesJson.length > 0;
}



async function generateGame() {
    const tmrwDate = new Date();
    tmrwDate.setDate(tmrwDate.getDate() + 3);
    const gameDate = tmrwDate.toISOString().split('T')[0];

    let i = 0;
    let leagueChoice = leagues[i];
    while (!(await checkGames(leagueChoice, gameDate)) && i < leagues.length - 1) {
        i++;
        leagueChoice = leagues[i];
    }

    let url = leagueChoice.includes('https://v3.football.api-sports.io') 
              ? `${leagueChoice}/fixtures?date=${gameDate}` 
              : `${leagueChoice}/games?date=${gameDate}`;

    const headers = {
        'x-rapidapi-key': 'a77cce330b5d21ba94ad6b1e642cb8bf',
        'x-rapidapi-host': leagueChoice.replace('https://', '')
    };

    const response = await fetch(url, { headers: headers });
    const responseJson = await response.json();
    let gameChoicesJson = [];

    switch (leagueChoice) {
        case 'https://v1.american-football.api-sports.io':
            gameChoicesJson = responseJson.response.filter(x => parseInt(x.game.date.time.split(':')[0]) <= 4);
            break;
        case 'https://v2.nba.api-sports.io':
            gameChoicesJson = responseJson.response.filter(x => parseInt(x.date.start.substring(11, 13)) <= 4);
            break;
        case 'https://v1.baseball.api-sports.io':
            gameChoicesJson = responseJson.response.filter(game => game.time < "04:00");
            break;
        case 'https://v3.football.api-sports.io':
            gameChoicesJson = responseJson.response.filter(x => parseInt(x.fixture.date.substring(11, 13)) <= 4);
            break;
    }

    const gameJson = gameChoicesJson[Math.floor(Math.random() * gameChoicesJson.length)];
    let gameInfo = {};

    switch (leagueChoice) {
        case 'https://v1.american-football.api-sports.io':
            gameInfo = {
                id: gameJson.game.id,
                date: gameJson.game.date.date,
                time: gameJson.game.date.time,
                home_team: gameJson.teams.home.name,
                away_team: gameJson.teams.away.name,
                home_logo: gameJson.teams.home.logo,
                away_logo: gameJson.teams.away.logo,
                league: leagueChoice
            };
            break;
        case 'https://v2.nba.api-sports.io':
            gameInfo = {
                id: gameJson.id,
                date: gameJson.date.start.split('T')[0],
                time: gameJson.date.start.split('T')[1].split(':').slice(0, 2).join(':'),
                home_logo: gameJson.teams.home.logo,
                away_logo: gameJson.teams.visitors.logo,
                home_team: gameJson.teams.home.name,
                away_team: gameJson.teams.visitors.name,
                league: leagueChoice
            };
            break;
        case 'https://v1.baseball.api-sports.io':
            gameInfo = {
                id: gameJson.id,
                date: gameJson.date.substring(0, 10),
                time: gameJson.time,
                home_team: gameJson.teams.home.name,
                away_team: gameJson.teams.away.name,
                home_logo: gameJson.teams.home.logo,
                away_logo: gameJson.teams.away.logo,
                league: leagueChoice
            };
            break;
        case 'https://v3.football.api-sports.io':
            gameInfo = {
                id: gameJson.fixture.id,
                date: gameJson.fixture.date.substring(0, 10),
                time: gameJson.fixture.date.split('T')[1].substring(0, 5),
                home_team: gameJson.fixture.teams.home.name,
                away_team: gameJson.fixture.teams.away.name,
                home_logo: gameJson.fixture.teams.home.logo,
                away_logo: gameJson.fixture.teams.away.logo,
                league: leagueChoice
            };
            break;
    }

    const convertedGame = convertUtcToPst(gameInfo);
    return convertedGame;
}
function convertUtcToPst(gameInfo) {
    // Assuming gameInfo.date and gameInfo.time are in UTC
    const utcDate = new Date(`${gameInfo.date}T${gameInfo.time}Z`);
    const pstDate = new Date(utcDate.getTime() - (8 * 60 * 60 * 1000)); // subtract 8 hours for PST

    gameInfo.date = pstDate.toISOString().split('T')[0];
    gameInfo.time = pstDate.toISOString().split('T')[1].substring(0, 5);

    return gameInfo;
}

async function insertGameToDb(gameInfo) {
    if (!gameInfo) {
        console.log('No game info provided');
        return;
    }
    
    try {
        const query = `INSERT INTO games (gameid, game_date, team1, team2, team1logo, team2logo, game_time, sport) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [gameInfo.id, gameInfo.date, gameInfo.home_team, gameInfo.away_team, gameInfo.home_logo, gameInfo.away_logo, gameInfo.time, gameInfo.league];
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
    await checkAndUpdateWinner().catch(console.error);
}


//Check for winner from yesterday's game
function getYesterdaysDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
}

// Function to update the winner in the database
async function updateWinnerInDB(gameId, winner) {
    const query = 'UPDATE games SET winner = ? WHERE gameid = ?';
    const [rows] = await db.promise().query(query, [winner, gameId]);
    return rows.affectedRows;
}
async function checkAndUpdateWinner() {
    
    const yesterdaysDate = getYesterdaysDate();
    console.log(yesterdaysDate)
    // Replace 'dateColumn' with the actual column name that stores the date in your games table
    const query = 'SELECT gameid, sport FROM games WHERE game_date = ?';
    const [games] = await db.promise().query(query, [yesterdaysDate]);
    console.log(games)
    for (const game of games) {
        const leagueUrl = leagues.find(url => url.includes(game.sport));
        if (leagueUrl) {
            const winner = await checkWinner(leagueUrl, game.gameid);
            await updateWinnerInDB(game.gameid, winner);
            console.log(`Updated winner for game ID ${game.gameid}: ${winner}`);
        }
    }
}

module.exports = { generateAndInsertGame }