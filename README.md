# GoodSport

## Description
GoodSport is a sports team schedule management app that will allow users to be added to a team, and view all events (games, practices, meetings, etc..) that are associated with their team. Admin users (coaches and managers) can add, update and delete events. 

## GoodSport Live Site
[GoodSport Live Site](https://goodsport-app.onrender.com)

## GoodSport Demo Video
[GoodSport Project Presentation](https://youtu.be/6Iu1r8glT7M)

## CRUD
- CREATE:
  * A user can create an account (a player account or an admin/coach account)
  * Add events (practices, games, meetings, etc...) for a team
- READ: 
  * Get all the events for a team
  * Get user account information
- UPDATE:
  * Update a team event
  * Update a user account info
- DELETE:
  * Delete an event
  * Delete a user account

## Stretch Goals / Future Features
- Tab for workout videos and drills that players can do
- An interapp message feature
- Users (Coaches and Players) can RSVP to events
- Coach can create individual player evaluations that are associated with a appropriate player account and can be viewed and commented on by the player

## Relationships
- A `Team` has many `Coach`es through `Event`
- A `Coach` has many `Team`s through `Event`
- An `Event` belongs to a `Team` and a `Coach`
- A `Team` has many `Player`s
- A `Player` belongs to a `Team`
- A `Coach` has many `Player`s 
- A `Player` has many `Coach`es 
- A `Club` has many `Coach`es
- A `Coach` belongs to a `Club`
- A `Club` has many `Team`s 
- A `Team` belongs to a `Club`

## Domain Model
![Domain Model](./images/Domain%20Models.png)
## Relationship Graph
![Relationship Graph](./images/Relationship%20Graph.png)

## Validations
- Player has a name, age and birthday
- Player has a parent_name and unique parent_email
- Player belongs to a team
- Coach has a name and club_id
- Team has a club_id, age_group, and a unique name
- Event has a team_id, coach_id, type and start_time
- Club has a name that is unique
- All emails must contain an '@' symbol

## Wireframe
![GoodSport Landing Page Wireframe](./images/GoodSport%20Wireframe.png)

## API Routes
- GET '/coaches'
- POST '/coaches'
- GET '/coaches/int:id'
- PATCH '/coaches/int:id'
- DELETE '/coaches/int:id'
- GET '/players'
- POST '/players'
- GET '/players/int:id'
- PATCH '/players/int:id'
- DELETE '/players/int:id'
- POST '/events'
- GET '/events'
- GET '/events/int:id'
- PATCH '/events/int:id'
- DELETE '/events/int:id'
- GET '/teams'
- GET '/teams/int:id'
- GET '/clubs'
- GET '/clubs/int:id'

## To Run In Development Environment
1. Fork and clone the repo
2. ```npm install``` (in directory with package.json) and ```pipenv install``` (in directory with Pipfile) (may have to go into shell to install )
3. ```pipenv shell```
4. cd into server and run ```python app.py``` to start server (should serve entire application at port: 5555) then  cd into the client folder and run ```npm start``` to spin up front end to hit the server
5. Can run `flask run` to start server on port 5000 (flacky)
6. Can run `guincorn app:app` to serve production ready very (also flaky)


## Deployment
1. Verify that PostgresSQL is installed
  - run `postgresql --version`
  If not installed:
  - Mac - `brew install postgresql` then `brew services start postgresql`
  - Windows - `sudo apt update`, `sudo apt install postgresql-contrib libpq-dev`, `psql --version`, `sudo service postgresql start`, `whoami`, `sudo -u postgres -i`, `createuser -sr <your_user_name>`, `logout` to exit

2. Make sure in your Pipfile you have, if not pip (or pipenv) install them
  - python-dotenv
  - gunicorn
  - psycopg2-binary
  - flask-SQLAlchemy
  - flask-migrate
  - SQLAlchemy-Serializer
  - flask-RESTful

3. Create a `requiremets.txt` via `pip (or pipenv) requirments > requirements.txt`
- pipenv install doesn't work in production environment, so we use this instead 
- It will list out all the requirements (dependencies and dependencies of our dependencies) and can be used like a Pipfile on the render machine to install those packages into that environet

4. Create a `.env` file: `touch .env`
`load_dotenv()` looks for a `.env` file in our project at the root and will load up any values as environment variables into our environment (development, production)
- In te `config.py` we can reference the enviroment variables like: `os.environ.get(env_var)`

5. This application is currently deployed on render. Either need to set up or login to the corresponding render account

6. Create a database and add the external database url to the .env file along with a secret key

7. Need to create our tables and seed the database (hopefully from our models)
`cd server` and start virtual environment `pipenv shell` now we can run any flask app commands
- `flask db upgrade` (create instance of databse)
- seed the database: `python seed.py`
To server a production type app run: `gunicorn app:app` 
