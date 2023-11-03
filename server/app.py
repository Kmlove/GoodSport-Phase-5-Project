#!/usr/bin/env python3
# Standard library imports
from datetime import datetime

# Remote library imports
from flask import request, make_response, jsonify, session
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
            new_coach_dict = new_coach.to_dict(rules=('-_password_hash', ))
            session['user_id'] = new_coach.id
            session['is_admin'] = new_coach.is_admin
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
        
        coach_to_dict = coach.to_dict(rules=('-_password_hash', '-club.teams', '-club_id', '-events.coach_id', '-events.team', "teams", "-teams.events", "-teams.players", "-teams.club"))
        return make_response(coach_to_dict, 200)
    
    def patch(self, id):
        coach = Coach.query.filter_by(id=id).first()

        if not coach:
            return make_response({"error": ["Coach Not Found"]}, 404)
        
        if request.json.get("currPassword"):
            if coach.authenticate(request.json["currPassword"]):
                try:
                    del request.json["currPassword"]
                    for attr in request.json:
                        setattr(coach, attr, request.json[attr])
                    db.session.add(coach)
                    db.session.commit()
                    coach_dict = coach.to_dict(rules=('-_password_hash', '-club.teams', '-club_id', '-events.coach_id', '-events.team'))
                    return make_response(coach_dict, 202)
                except ValueError as error:
                    response = jsonify({"Validation Error": [str(error)]})
                    return make_response(response, 400)
            else:
                return make_response({"error": ["Password not authenticated"]}, 401)
        else:
            try:
                for attr in request.json:
                    setattr(coach, attr, request.json[attr])
                db.session.add(coach)
                db.session.commit()
                coach_dict = coach.to_dict(rules=('-_password_hash', '-club.teams', '-club_id', '-events.coach_id', '-events.team'))
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
        session['user_id'] = None
        session['is_admin'] = None
        return make_response({}, 204)
api.add_resource(CoachesById, '/coaches/<int:id>')

class Players(Resource):
    def get(self):
        players = [player.to_dict(rules=('-_password_hash', '-team')) for player in Player.query.all()]
        return make_response(players, 200)
    
    def post(self):
        try:
            # Parse the date string from request.json into a Python date object
            birthday_str = request.json['birthday']
            birthday_obj = datetime.strptime(birthday_str, '%Y-%m-%d').date()

            new_player = Player(
                team_id = request.json['team_id'],
                player_name = request.json['player_name'],
                birthday = birthday_obj,
                parent_name = request.json['parent_name'],
                parent_email = request.json['parent_email'],
                password_hash = request.json['password'],
                gender = request.json['gender']
            )
            db.session.add(new_player)
            db.session.commit()
            new_player_dict = new_player.to_dict(rules=('-_password_hash', '-team.club', '-team.events.coach', '-team.events.team_id', '-team_id'))
            session['user_id'] = new_player.id
            session['is_admin'] = new_player.is_admin
            return make_response(new_player_dict, 201)
        except ValueError as error:
            response = jsonify({"Validation Error": [str(error)]})
            return make_response(response, 400)
api.add_resource(Players, '/players')

class PlayersById(Resource):
    def get(self, id):
        player = Player.query.filter_by(id=id).first()

        if not player:
            return make_response({"error": ["Player Not Found"]}, 404)
        
        player_to_dict = player.to_dict(rules=('-_password_hash', '-team.club', '-team.events.coach', '-team.events.team_id', '-team_id'))
        return make_response(player_to_dict, 200)
    
    def patch(self, id):
        player = Player.query.filter_by(id=id).first()
 
        if not player:
            return make_response({"error": ["Player Not Found"]}, 404)
        
        # Parse the date string from request.json into a Python date object
        birthday_str = request.json['birthday']
        birthday_obj = datetime.strptime(birthday_str, '%Y-%m-%d').date()
        
        if request.json.get("currPassword"):
            if player.authenticate(request.json["currPassword"]):
                try:
                    del request.json["currPassword"]
                    for attr in request.json:
                        if attr == "birthday":
                            setattr(player, attr, birthday_obj)
                        else:
                            setattr(player, attr, request.json[attr])
                    db.session.add(player)
                    db.session.commit()
                    player_dict = player.to_dict(rules=('-_password_hash', '-team.club', '-team.events.coach', '-team.events.team_id', '-team_id'))
                    return make_response(player_dict, 202)
                except ValueError as error:
                    response = jsonify({"Validation Error": [str(error)]})
                    return make_response(response, 400)
            else:
                return make_response({"error": ["Password not authenticated"]}, 401)
        else:
            try:
                for attr in request.json:
                    if attr == "birthday":
                        setattr(player, attr, birthday_obj)
                    else:
                        setattr(player, attr, request.json[attr])
                db.session.add(player)
                db.session.commit()
                player_dict = player.to_dict(rules=('-_password_hash', '-team.club', '-team.events.coach', '-team.events.team_id', '-team_id'))
                return make_response(player_dict, 202)
            except ValueError as error:
                response = jsonify({"Validation Error": [str(error)]})
                return make_response(response, 400)
        
    def delete(self, id):
        player = Player.query.filter_by(id=id).first()

        if not player:
            return make_response({"error": ["Player Not Found"]}, 404)
        
        db.session.delete(player)
        db.session.commit()
        session['user_id'] = None
        session['is_admin'] = None
        return make_response({}, 204)
api.add_resource(PlayersById, '/players/<int:id>')

class Teams(Resource):
    def get(self):
        teams = [team.to_dict(rules=('-events', '-players', '-club')) for team in Team.query.all()]
        return make_response(teams, 200)
    
    def post(self):
        try:
            new_team = Team(
                club_id = request.json['club_id'],
                team_name = request.json['team_name'],
                sport = request.json['sport'],
                age_group = request.json['age_group'],
                gender = request.json['gender']
            )
            db.session.add(new_team)
            db.session.commit()
            new_team_dict = new_team.to_dict(rules=('-events', '-players', '-club_id'))
            return make_response(new_team_dict, 201)
        except ValueError as error:
            response = jsonify({"Validation Error": [str(error)]})
            return make_response(response, 400)
api.add_resource(Teams, '/teams')

class TeamsById(Resource):
    def get(self, id):
        team = Team.query.filter_by(id=id).first()

        if not team:
            return make_response({"error": ["Team Not Found"]}, 404)
        
        team_to_dict = team.to_dict(rules=( '-events.coach', '-events.team_id', '-players._password_hash', '-players.team_id', '-players.is_admin', 'coaches', '-coaches.events', '-coaches.club'))
        return make_response(team_to_dict, 200)
    
    def patch(self, id):
        team = Team.query.filter_by(id=id).first()

        if not team:
            return make_response({"error": ["Team Not Found"]}, 404)
        
        try:
            for attr in request.json:
                setattr(team, attr, request.json[attr])
            db.session.add(team)
            db.session.commit()
            team_dict = team.to_dict(rules=('-club', '-events.coach', '-events.team_id', '-players._password_hash', '-players.team_id', '-players.is_admin'))
            return make_response(team_dict, 202)
        except ValueError as error:
            response = jsonify({"Validation Error": [str(error)]})
            return make_response(response, 400)
        
    def delete(self, id):
        team = Team.query.filter_by(id=id).first()

        if not team:
            return make_response({"error": ["Team Not Found"]}, 404)
        
        db.session.delete(team)
        db.session.commit()
        return make_response({}, 204)
api.add_resource(TeamsById, '/teams/<int:id>')

class Events(Resource):
    def get(self):
        events = [event.to_dict(rules=('-coach', '-team')) for event in Event.query.all()]
        return make_response(events, 200)
    
    def post(self):
        try:
            # Parse the date string from request.json into a Python date object
            date_str = request.json['date']
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()

            new_event = Event(
                team_id = request.json['team_id'],
                coach_id = request.json['coach_id'],
                event_type = request.json['event_type'],
                date = date_obj,
                event_time = request.json['event_time'],
                location = request.json['location'],
                notes = request.json['notes']
            )
            db.session.add(new_event)
            db.session.commit()
            new_event_dict = new_event.to_dict(rules=('-coach._password_hash', '-coach.club', '-team_id', '-coach.is_admin', '-coach_id', '-coach.email', '-team.club', '-team.players._password_hash', '-team.players.birthday', '-team.players.parent_name', '-team.players.parent_email', '-team.players.team_id', '-team.players.is_admin'))
            return make_response(new_event_dict, 201)
        except ValueError as error:
            response = jsonify({"Validation Error": [str(error)]})
            return make_response(response, 400)
api.add_resource(Events, '/events')

class EventsById(Resource):
    def get(self, id):
        event = Event.query.filter_by(id=id).first()

        if not event:
            return make_response({"error": ["Event Not Found"]}, 404)
        
        event_to_dict = event.to_dict(rules=('-coach._password_hash', '-coach.club', '-team_id', '-coach.is_admin', '-coach_id', '-coach.email', '-team.club', '-team.players._password_hash', '-team.players.birthday', '-team.players.parent_name', '-team.players.parent_email', '-team.players.team_id', '-team.players.is_admin'))
        return make_response(event_to_dict, 200)
    
    def patch(self, id):
        event = Event.query.filter_by(id=id).first()

        if not event:
            return make_response({"error": ["Event Not Found"]}, 404)
        
        try:
            for attr in request.json:
                if attr == 'date':
                    # Parse the date string from request.json into a Python date object
                    date_str = request.json['date']
                    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
                    setattr(event, attr, date_obj)
                else:
                    setattr(event, attr, request.json[attr])
            db.session.add(event)
            db.session.commit()
            event_dict = event.to_dict(rules=('-coach._password_hash', '-coach.club', '-team_id', '-coach.is_admin', '-coach_id', '-coach.email', '-team.club', '-team.players._password_hash', '-team.players.birthday', '-team.players.parent_name', '-team.players.parent_email', '-team.players.team_id', '-team.players.is_admin'))
            return make_response(event_dict, 202)
        except ValueError as error:
            response = jsonify({"Validation Error": [str(error)]})
            return make_response(response, 400)
        
    def delete(self, id):
        event = Event.query.filter_by(id=id).first()

        if not event:
            return make_response({"error": ["Event Not Found"]}, 404)
        
        db.session.delete(event)
        db.session.commit()
        return make_response({}, 204)
api.add_resource(EventsById, '/events/<int:id>')

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

class Login(Resource):
    def post(self):
        user = Coach.query.filter_by(email=request.json['email']).first()
        if not user:
            user = Player.query.filter_by(parent_email=request.json['email']).first()

        password = request.json['password']

        if user and user.authenticate(password):
            session['user_id'] = user.id
            session['is_admin'] = user.is_admin
            
            if user.is_admin == True:
                coach_to_dict = user.to_dict(rules=('-_password_hash', '-club.teams', '-club_id', '-events.coach_id', '-events.team'))
                return make_response(coach_to_dict, 200)
            elif user.is_admin == False:
                player_dict = user.to_dict(rules=('-_password_hash', '-team.events.coach', '-team.events.team_id', '-team_id'))
                return make_response(player_dict, 200)
        else:
            return make_response({"error": ["User Not Found"]}, 404)

api.add_resource(Login, '/login')

class AutoLogin(Resource):
    def get(self):
        if session.get('user_id'):
            if session['is_admin'] == True:
                user = Coach.query.filter_by(id=session['user_id']).first()
            elif session['is_admin'] == False:
                user = Player.query.filter_by(id=session['user_id']).first()

            if user:
                if user.is_admin == True:
                    coach_to_dict = user.to_dict(rules=('-_password_hash', '-club.teams', '-club_id', '-events.coach_id', '-events.team'))
                    return make_response(coach_to_dict, 200)
                elif user.is_admin == False:
                    player_dict = user.to_dict(rules=('-_password_hash', '-team.events.coach', '-team.events.team_id', '-team_id'))
                    return make_response(player_dict, 200)
            else:
                return make_response({"Errors": "User not found"}, 404)
        else:
            return make_response({"Error": ["User Not Authorized"]}, 401)
api.add_resource(AutoLogin, '/auto_login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        session['is_admin'] = None
        return make_response({}, 204)
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)