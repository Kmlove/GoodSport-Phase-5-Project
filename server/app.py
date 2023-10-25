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

class Coaches(Resource):
    def get(self):
        coaches = [coach.to_dict(rules=('-events', '-_password_hash', '-club')) for coach in Coach.query.all()]
        return make_response(coaches, 200)
    
    def post(self):
        try:
            new_coach = Coach(
                club_id = request.json['club_id'],
                coach_name = request.json['coach_name'],
                email = request.json['email'],
                password_hash = request.json['password']
            )
            db.session.add(new_coach)
            db.session.commit()
            new_coach_dict = new_coach.to_dict(rules=('-events', '-_password_hash', '-club'))
            return make_response(new_coach_dict, 201)
        except ValueError as error:
            response = jsonify({"Validation Error": [str(error)]})
            return make_response(response, 400)
api.add_resource(Coaches, '/coaches')

class CoachesById(Resource):
    def get(self, id):
        coach = Coach.query.filter_by(id=id).first()

        if not coach:
            return make_response({"error": ["Coach Not Found"]}, 404)
        return make_response(coach.to_dict(), 200)
    
    def patch(self, id):
        coach = Coach.query.filter_by(id=id).first()

        if not coach:
            return make_response({"error": ["Coach Not Found"]}, 404)
        
        try:
            for attr in request.json:
                setattr(coach, attr, request.json[attr])
            db.session.add(coach)
            db.session.commit()
            coach_dict = coach.to_dict(rules=('-events', '-_password_hash', '-club'))
            return make_response(coach_dict, 202)
        except ValueError as error:
            response = jsonify({"Validation Error": [str(error)]})
            return make_response(response, 400)
        
    def delete(self, id):
        coach = Coach.query.filter_by(id=id).first()

        if not coach:
            return make_response({"error": ["Coach Not Found"]}, 404)
        
        db.session.delete(coach)
        db.session.commit()
        return make_response({}, 204)
api.add_resource(CoachesById, '/coaches/<int:id>')

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
        except ValueError as error:
            response = jsonify({"Validation Error": [str(error)]})
            return make_response(response, 400)
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

