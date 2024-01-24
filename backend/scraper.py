import requests
import random
from datetime import datetime

# Function to get games for a given sport and API endpoint
def get_games(api_key, sport, url):
    headers = {'x-apisports-key': api_key}
    date = datetime.now().strftime('%Y-%m-%d')
    response = requests.get(url, headers=headers, params={'date': date})
    if response.status_code == 200:
        games = response.json()
        if games and 'response' in games and games['response']:
            return games['response']
    return None

# Main function
def find_game(api_key):
    sports = [
        {'name': 'Basketball', 'url': 'https://v1.basketball.api-sports.io'},
        {'name': 'NBA', 'url': 'https://v2.nba.api-sports.io'},
        {'name': 'NFL', 'url': 'https://v1.american-football.api-sports.io'}
    ]

    while True:
        sport = random.choice(sports)
        games = get_games(api_key, sport['name'], sport['url'])
        if games:
            return sport['name'], games[0]  # Assuming we take the first game found
        else:
            # Remove the sport with no games and continue if there are still sports left
            sports.remove(sport)
            if not sports:
                break

    return None, None

# Replace 'your_api_key_here' with your actual API key
api_key = '4ad171719b632dfd4faf8774291732a7'
sport, game = find_game(api_key)
if sport and game:
    print(f"Sport: {sport}, Game: {game}")
else:
    print("No games found for today.")