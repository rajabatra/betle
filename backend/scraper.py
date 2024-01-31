import requests
import urllib
from datetime import datetime, timedelta
import http.client
import random
import json
import pytz
import sqlite3



leagues = ['https://v1.american-football.api-sports.io',
           'https://v2.nba.api-sports.io',
           'https://v1.baseball.api-sports.io',
            'https://v3.football.api-sports.io']


def checkGames(league_url, date):
   
    url = ""
    if league_url == 'https://v3.football.api-sports.io':
        url = league_url+'/fixtures?date='+date
    else:
        url = league_url+'/games?date='+date
    payload={}
    headers = {
    'x-rapidapi-key': 'a77cce330b5d21ba94ad6b1e642cb8bf',
    'x-rapidapi-host': league_url
    }
    
    response = requests.request("GET", url, headers=headers, data=payload)
    response_json = response.json()['response']
    if league_url == "https://v1.american-football.api-sports.io":
        #game_choices_json = [x for x in response_json if int(x['game']['date']['time'][1]) <= 4]
        game_choices_json = [x for x in response_json if int(x['game']['date']['time'].split(':')[0]) <= 4]
    if league_url == "https://v2.nba.api-sports.io":
        game_choices_json = [x for x in response_json if int(x['date']['start'][11:13]) <= 4]
    if league_url == "https://v1.baseball.api-sports.io":
        game_choices_json = [game for game in response_json if game['time'] < "04:00"]
    if league_url == "https://v3.football.api-sports.io":
        game_choices_json = [x for x in response_json if int(x['fixture']['date'][11:13]) <= 4]
    #print(response_json)
    print('tested' + league_url)
    #print(game_choices_json)
    return len(game_choices_json) > 0
    #return response.json()["results"] != 0
    

def generateGame():
    tmrwDate = datetime.now() + timedelta(3)
    gameDate = tmrwDate.strftime('%Y-%m-%d')
    
    i = 0
    leagueChoice = leagues[i]
    while checkGames(leagueChoice, gameDate) == False:
        i = i+1
        leagueChoice = leagues[i]
    url = ""
    
    if leagueChoice == 'https://v3.football.api-sports.io':
        url = leagueChoice+'/fixtures?date='+gameDate
    else:
        url = leagueChoice+'/games?date='+gameDate
    payload={}
    headers = {
    'x-rapidapi-key': 'a77cce330b5d21ba94ad6b1e642cb8bf',
    'x-rapidapi-host': leagueChoice
    }
    response = requests.request("GET", url, headers=headers, data=payload)
    response_json = response.json()['response']
    
    game_choices_json = []
    if leagueChoice == "https://v1.american-football.api-sports.io":
        game_choices_json = [x for x in response_json if int(x['game']['date']['time'].split(':')[0]) <= 4]
    if leagueChoice == "https://v2.nba.api-sports.io":
        game_choices_json = [x for x in response_json if int(x['date']['start'][11:13]) <= 4]
    if leagueChoice == "https://v1.baseball.api-sports.io":
        game_choices_json = [x for x in response_json if x['time'] < "04:00"]
    if leagueChoice == "https://v3.football.api-sports.io":
        game_choices_json = [x for x in response_json if int(x['fixture']['date'][11:13]) <= 4]

    game_json = game_choices_json[random.randint(0,len(game_choices_json)-1)]

    game_json = game_choices_json[random.randint(0,len(game_choices_json)-1)]
    
    # Extract game information
    #for football
    game_info ={}
    if leagueChoice == leagues[0]:
        game_info = {
            'id': game_json['game']['id'],
            'date': game_json['game']['date']['date'],
            'time': game_json['game']['date']['time'],
            'home_team': game_json['teams']['home']['name'],
            'away_team': game_json['teams']['away']['name'],
            'home_logo': game_json['teams']['home']['logo'],
            'away_logo': game_json['teams']['away']['logo'],
            'league': leagueChoice
        }
    ##for nba 
    elif leagueChoice == leagues[1]:
        game_info = {
            'id': game_json['id'],
            'date': game_json['date']['start'].split('T')[0],
            'time': ':'.join(game_json['date']['start'].split('T')[1].split(':')[0:2]),
            'home_logo': game_json['teams']['home']['logo'],
            'away_logo': game_json['teams']['visitors']['logo'],
            'home_team': game_json['teams']['home']['name'],
            'away_team': game_json['teams']['visitors']['name'],
            'league': leagueChoice
        }
    elif leagueChoice == leagues[2]:
        game_info = {
            'id': game_json['id'],
            'date': game_json['date'][:10],
            'time': game_json['time'],
            'home_team': game_json['teams']['home']['name'],
            'away_team': game_json['teams']['away']['name'],
            'home_logo': game_json['teams']['home']['logo'],
            'away_logo': game_json['teams']['away']['logo'],
            'league': leagueChoice
        }
    elif leagueChoice == leagues[3]:
        game_info = {
            'id': game_json['fixture']['id'],
            'date': game_json['fixture']['date'][:10],
            'time': game_json['fixture']['date'].split('T')[1][:5],
            'home_team': game_json['fixture']['teams']['home']['name'],
            'away_team': game_json['fixture']['teams']['away']['name'],
            'home_logo': game_json['fixture']['teams']['home']['logo'],
            'away_logo': game_json['fixture']['teams']['away']['logo'],
            'league': leagueChoice

        }




    converted_game = convert_utc_to_pst(game_info)
    return converted_game

def convert_utc_to_pst(game_info):
    # Combining date and time into a single string
    date_time_str = f"{game_info['date']} {game_info['time']}"

    # Create a datetime object in UTC
    utc_time = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M')
    utc_time = pytz.utc.localize(utc_time)

    # Define the PST timezone
    pst_zone = pytz.timezone('America/Los_Angeles')

    # Convert to PST
    pst_time = utc_time.astimezone(pst_zone)

    # Update the dictionary
    game_info['date'] = pst_time.strftime('%Y-%m-%d')
    game_info['time'] = pst_time.strftime('%H:%M')

    return game_info

gamedict = generateGame()



print(gamedict)


