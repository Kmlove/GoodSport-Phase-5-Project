# Remote library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

# Local imports
from config import db

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
        
    def __repr__(self):
        return f"<{self.id}: {self.team_name}, {self.sport}>"