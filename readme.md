RodBot
======

An irc bot which monitors links posted and performs a search of Box UK's IRC logs to see if the link has been posted before.

Posting a link someone has already posted is known in the company as a 'rodding', named after our very own [rodnaph](https://github.com/rodnaph).

Being rodded is the greatest shame a BoxUKer can endure.

## Installation

Check out the repo

    got clone git@github.com:stevehalford/RodBot.git 

Create a config.json file and input your server credentials

    cp config.json.sample config.json

Install required dependencies

    npm link

Run the bot

    node rodbot.js

