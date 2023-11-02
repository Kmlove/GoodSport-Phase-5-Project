# Remote library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

# Local imports
from config import db
from .event import Event

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
    coaches = association_proxy("events", "coach", creator= lambda coach_obj : Event(coach=coach_obj))

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
        
    @validates('club_id')
    def validate_club_id(self, key, value):
        if not value:
            raise ValueError('Coach must belong to a club')
        elif type(value) is not int or value < 1:
            raise ValueError('club_id must be an int greater than 0')
        else:
            return value
        
    def __repr__(self):
        return f"<{self.id}: {self.team_name}, {self.sport}>"