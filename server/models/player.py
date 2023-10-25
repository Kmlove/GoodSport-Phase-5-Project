# Remote library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy

# Local imports
from config import db, bcrypt

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

    # password hash and validations
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    @password_hash.setter
    def password_hash(self, password):
        if type(password) is str and len(password) > 6:
            password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
            self._password_hash = password_hash.decode('utf-8')
        else:
            raise ValueError('Password Invalid')
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

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
        elif type(value) is not int or value < 1:
            raise ValueError('team_id must be an int greater than 0')
        else:
            return value
        
    def __repr__(self):
        return f"<{self.id}: {self.player_name}>"