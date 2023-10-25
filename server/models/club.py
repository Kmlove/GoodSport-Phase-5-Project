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
    # serialize_rules = ('-teams.club', '-coaches.club', '-team.players', '-team.events')
    serialize_only = ('id', 'club_name', 'teams.team_name', 'teams.id', 'coaches.coach_name', 'coaches.id')

    def __repr__(self):
        return f"<{self.id}: {self.club_name}>"