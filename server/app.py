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



class Clubs(Resource):
    def get(self):
        clubs = [club.to_dict() for club in Club.query.all()]
        return make_response(clubs, 200)
    
    def post(self):
        try:
            new_club = Club(
                club_name = request.json['club_name']
            )
            db.session.add(new_club)
            db.session.commit()
            return make_response(new_club.to_dict(), 201)
        except ValueError:
            return make_response({"error":["Validation Errors"]}, 400)
api.add_resource(Clubs, '/clubs')

class ClubsById(Resource):
    def get(self, id):
        club = Club.query.filter_by(id=id).first()

        if not club:
            return make_response({"error": ["Club Not Found"]}, 404)
        return make_response(club.to_dict(), 200)
api.add_resource(ClubsById, '/clubs/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

