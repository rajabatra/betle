import requests
import urllib
from datetime import datetime, timedelta
import http.client
import random
import json
import pytz
import sqlite3

# Database connection parameters
host = "your_host"
database = "your_database"
user = "your_username"
password = "your_password"

leagues = ['https://v1.american-football.api-sports.io',
           'https://v2.nba.api-sports.io',
           'https://v1.baseball.api-sports.io',
            'https://v3.football.api-sports.io']

def getLeague():
    return leagues[random.randint(0,4)]

# print(getLeague())
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
    print('tested' + league_url)
    return response.json()["results"] != 0
    
# print(checkGames('https://v2.nba.api-sports.io', '2024-01-24'))
# url = "https://v3.football.api-sports.io/leagues"

def convert_to_pst(utc_date_str):
    utc_zone = pytz.timezone('UTC')
    pst_zone = pytz.timezone('America/Los_Angeles')
    utc_datetime = utc_zone.localize(datetime.strptime(utc_date_str, '%Y-%m-%d %H:%M'))
    pst_datetime = utc_datetime.astimezone(pst_zone)
    return pst_datetime.strftime('%Y-%m-%d %H:%M')

def generateGame():
    tmrwDate = datetime.now() + timedelta(2)
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
    #print(response_json[0]['date']['start'][12])
    game_choices_json = []
    if leagueChoice == "https://v1.american-football.api-sports.io":
        #game_choices_json = [x for x in response_json if int(x['game']['date']['time'][1]) <= 4]
        game_choices_json = [x for x in response_json if int(x['game']['date']['time'].split(':')[0]) <= 4]
    if leagueChoice == "https://v2.nba.api-sports.io":
        #game_choices_json = [x for x in response_json if int(x['date']['start'][12]) <= 4]
        game_choices_json = [x for x in response_json if int(x['date']['start'].split('T')[1][:2]) <= 4]
    if leagueChoice == "https://v1.baseball.api-sports.io":
        #game_choices_json = [x for x in response_json if int(x['time'][1]) <= 4]
        game_choices_json = [x for x in response_json if int(x['time'].split(':')[0]) <= 4]
    if leagueChoice == "https://v3.football.api-sports.io":
        #game_choices_json = [x for x in response_json if int(x['fxture']['date'][12]) <= 4]
        game_choices_json = [x for x in response_json if int(x['fixture']['date'].split('T')[1][:2]) <= 4]
    #game_json = game_choices_json[random.randint(0,len(game_choices_json)-1)]
    #print(game_json)
    game_json = game_choices_json[random.randint(0,len(game_choices_json)-1)]
    #print(game_json)
    #print(leagueChoice)
    # Extract game information
    #for football
    game_info ={}
    if leagueChoice == leagues[0]:
        game_info = {
            'id': game_json['game']['id'],
            'date': game_json['game']['date']['date'],
            'time': game_json['game']['date']['time'],
            'home_team': game_json['teams']['home']['name'],
            'away_team': game_json['teams']['away']['name']
        }
    ##for nba 
    elif leagueChoice == leagues[1]:
        game_info = {
            'id': game_json['id'],
            'date': game_json['date']['start'][:10],
            'time': game_json['date']['start'].split('T')[1][:5],
            'home_team': game_json['teams']['home']['name'],
            'away_team': game_json['teams']['visitors']['name']
        }
    elif leagueChoice == leagues[2]:
        game_info = {
            'id': game_json['id'],
            'date': game_json['date'][:10],
            'time': game_json['time'],
            'home_team': game_json['teams']['home']['name'],
            'away_team': game_json['teams']['away']['name']
        }
    elif leagueChoice == leagues[3]:
        game_info = {
            'id': game_json['fixture']['id'],
            'date': game_json['fixture']['date'][:10],
            'time': game_json['fixture']['date'].split('T')[1][:5],
            'home_team': game_json['fixture']['teams']['home']['name'],
            'away_team': game_json['fixture']['teams']['away']['name']
        }




    # Convert date and time to PST
    #datetime_utc = f"{game_info['date']} {game_info['time']}"
    #datetime_pst = convert_to_pst(datetime_utc)
    #game_info['datetime_pst'] = datetime_pst
    #print
    return game_info
gamedict = generateGame()
print(gamedict)