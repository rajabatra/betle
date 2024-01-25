import requests
import urllib
from datetime import datetime, timedelta
import http.client
import random
import json

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
        game_choices_json = [x for x in response_json if int(x['game']['date']['time'][1]) <= 4]
    if leagueChoice == "https://v2.nba.api-sports.io":
        game_choices_json = [x for x in response_json if int(x['date']['start'][12]) <= 4]
    if leagueChoice == "https://v1.baseball.api-sports.io":
        game_choices_json = [x for x in response_json if int(x['time'][1]) <= 4]
    if leagueChoice == "https://v3.football.api-sports.io":
        game_choices_json = [x for x in response_json if int(x['fixture']['date'][12]) <= 4]
    game_json = game_choices_json[random.randint(0,len(game_choices_json)-1)]
    print(game_json)

generateGame()