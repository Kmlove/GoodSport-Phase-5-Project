# Remote library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

# Local imports
from config import db

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