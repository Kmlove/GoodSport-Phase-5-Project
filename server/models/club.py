# Remote library imports
from sqlalchemy_serializer import SerializerMixin

# Local imports
from config import db

class Club(db.Model, SerializerMixin):
    __tablename__ = 'clubs'

    id = db.Column(db.Integer, primary_key=True)
    club_name = db.Column(db.String, unique=True)

    # relationships
    teams = db.relationship('Team', back_populates='club', cascade='all, delete-orphan')
    coaches = db.relationship('Coach', back_populates='club', cascade='all, delete-orphan')

    # serialize rules
    serialize_rules = ('-teams.club', '-coaches.club')