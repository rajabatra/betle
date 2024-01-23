import requests
from bs4 import BeautifulSoup
import random

# URL of the "Live Sports on TV Today" link
url = "https://sportsgamestoday.com"

# Send a GET request to the URL
response = requests.get(url)

# Parse the HTML content of the page
soup = BeautifulSoup(response.content, "html.parser")

# Get the date
date = soup.find("div", class_="gametitle").text.strip()

# Get the list of games
games = soup.find_all("tr")

# Choose a random game
random_game_index = random.randint(1, len(games) - 1)
selected_game = games[random_game_index]

# Extract information about the selected game

teams = selected_game.find("td", class_="gamematchup").text.strip()
game_time = selected_game.find("td", class_="gametime").text.strip()
tv_channel = selected_game.find("td", class_="gametvchannel").text.strip()

# Store the information in your database
# (You'll need to replace this with your actual database storage code)

# Print the information
print(f"Date: {date}")
print(f"Teams: {teams}")
print(f"Game Time: {game_time}")
print(f"TV Channel: {tv_channel}")