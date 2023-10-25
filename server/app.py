#!/usr/bin/env python3

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource, Api

# Local imports
from config import app, db
from models.coach import Coach
from models.club import Club
from models.event import Event
from models.player import Player
from models.team import Team

# Instantiate REST API
api = Api(app)

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

