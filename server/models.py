from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db

# Models go here!
class Team(db.Model, SerializerMixin):
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True)
    club_id = db.Column(db.Integer, db.ForeignKey('clubs.id'), nullable=False)
    team_name = db.Column(db.String, unique=True)
    sport = db.Column(db.String)
    age_group = db.Column(db.String, nullable=False)
    gender = db.Column(db.String)

    # relationships
    events = db.relationship('Event', back_populates='team', cascade='all, delete-orphan')
    players = db.relationship('Player', back_populates='team', cascade='all, delete-orphan')
    club = db.relationship('Club', back_populates='teams')

    # serialize rules
    serialize_rules = ('-events.team', '-players.team', '-club.teams')

    # validations
    @validates('team_name')
    def validate_team_name(sef, key, name):
        if not name:
            raise ValueError('Team name must exist')
        else:
            return name
        
    @validates('age_group')
    def validate_age_group(self, key, value):
        if not value:
            raise ValueError('Team must have an age group')
        else:
            return value

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.id'), nullable=False)
    event_type = db.Column(db.String)
    date = db.Column(db.Date)
    start_time = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    location = db.Column(db.String)

    # relationships
    team = db.relationship('Team', back_populates='events')
    coach = db.relationship('Coach', back_populates='events')

    # serialize rules
    serialize_rules = ('-team.events', '-coach.events')

    # validations
    @validates('team_id', 'coach_id', 'event_type', 'date', 'start_time')
    def validate_ids(self, key, value):
        if not value:
            raise ValueError('Event needs a coach, team, event type, date and start time')
        else:
            return value

class Coach(db.Model, SerializerMixin):
    __tablename__ = 'coaches'

    id = db.Column(db.Integer, primary_key=True)
    club_id = db.Column(db.Integer, db.ForeignKey('clubs.id'), nullable=False)
    coach_name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)
    is_admin = db.Column(db.Boolean, default=True)

    # relationships
    events = db.relationship('Event', back_populates='coach', cascade='all, delete-orphan')
    club = db.relationship('Club', back_populates='coaches')

    # serialize rules
    serialize_rules = ('-events.coach', '-club.coaches')

    # validations
    @validates('coach_name')
    def validate_coach_name(sef, key, name):
        if not name:
            raise ValueError('Coach name must exist')
        else:
            return name
        
    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError('Coach email must be present')
        elif '@' not in email:
            raise ValueError('Must enter a vaild email address')
        else: 
            return email
        
    @validates('club_id')
    def validate_club_id(self, key, value):
        if not value:
            raise ValueError('Coach must belong to a club')
        else:
            return value

class Player(db.Model, SerializerMixin):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    player_name = db.Column(db.String)
    birthday = db.Column(db.Date)
    parent_name = db.Column(db.String)
    parent_email = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)
    is_admin = db.Column(db.Boolean, default=False)

    # relationships
    team = db.relationship('Team', back_populates='players')

    # serialize rules
    serialize_rules = ('-team.players',)

    # validations
    @validates('player_name', 'parent_name')
    def validate_names(sef, key, name):
        if not name:
            raise ValueError('Player and Parent name must exist')
        else:
            return name
        
    @validates('parent_email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError('Parent email must be present')
        elif '@' not in email:
            raise ValueError('Must enter a vaild email address')
        else: 
            return email
        
    @validates('birthday')
    def validate_birthday(self, key, birthday):
        if not birthday:
            raise ValueError('Player birthday must be present')
        else:
            return birthday
        
    @validates('team_id')
    def validate_team_id(self, key, value):
        if not value:
            raise ValueError('Player must belong to a team')
        else:
            return value

class Club(db.Model, SerializerMixin):
    __tablename__ = 'clubs'

    id = db.Column(db.Integer, primary_key=True)
    club_name = db.Column(db.String, unique=True)

    # relationships
    teams = db.relationship('Team', back_populates='club', cascade='all, delete-orphan')
    coaches = db.relationship('Coach', back_populates='club', cascade='all, delete-orphan')

    # serialize rules
    serialize_rules = ('-teams.club', '-coaches.club')