# Remote library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy

# Local imports
from config import db, bcrypt

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
        
    def __repr__(self):
        return f"<{self.id}: {self.coach_name}>"