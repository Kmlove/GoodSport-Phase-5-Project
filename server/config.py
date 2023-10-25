# Remote library imports
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS

# Define metadata, instantiate db
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)

# Instantiate app and set attributes
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.secret_key = b'(\x18\x8a>Z)\xcfeQ\xc4\xcd|Rnw\xf9'

db.init_app(app)

migrate = Migrate(app, db)

# Instantiate CORS
CORS(app)

# Instantiate Bcrypt with app
bcrypt = Bcrypt(app)