from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class Team(db.Model, SerializerMixin):
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True)
    club_id = db.Column(db.Integer, db.ForeignKey('clubs.id'), nullable=False)
    team_name = db.Column(db.String, unique=True)
    sport = db.Column(db.String)
    age_group = db.Column(db.String, nullable=False)
    sex = db.Column(db.String)

    # relationships
    events = db.relationship('Event', back_populates='team', cascade='all, delete-orphan')
    players = db.relationship('Player', back_populates='team', cascade='all, delete-orphan')
    club = db.relationship('Club', back_populates='teams')

    # serialize rules
    serialize_rules = ('-events.team', '-players.team', '-club.teams')

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    coach_id = db.Column(db.Integer, db.ForeignKey('coaches.id'), nullable=False)
    event_type = db.Column(db.String)
    date = db.Column(db.Date)
    duration = db.Column(db.Integer)
    location = db.Column(db.String)

    # relationships
    team = db.relationship('Team', back_populates='events')
    coach = db.relationship('Coach', back_populates='events')

    # serialize rules
    serialize_rules = ('-team.events', '-coach.events')

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

class Club(db.Model, SerializerMixin):
    __tablename__ = 'clubs'

    id = db.Column(db.Integer, primary_key=True)
    club_name = db.Column(db.String, unique=True)

    # relationships
    teams = db.relationship('Team', back_populates='club', cascade='all, delete-orphan')
    coaches = db.relationship('Coach', back_populates='club', cascade='all, delete-orphan')

    # serialize rules
    serialize_rules = ('-teams.club', '-coaches.club')