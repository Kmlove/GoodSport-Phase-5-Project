#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from app import app
from config import db
from models import *

def create_clubs():
    clubs = []

    c1 = Club(
        club_name = 'DC Soccer Club'
    )

    c2 = Club(
        club_name = 'Arlington Soccer Club'
    )

    c3 = Club(
        club_name = 'DC Basketball Club'
    )

    c4 = Club(
        club_name = 'Arlington Basketball Club'
    )

    clubs.extend([c1, c2, c3, c4])

    return clubs

def create_teams(clubs):
    teams = []

    t1 = Team(
        club = clubs[0],
        team_name = 'Lightning',
        sport = 'Soccer',
        age_group = 'U15',
        gender = 'F'
    )

    t2 = Team(
        club = clubs[1],
        team_name = 'Sirens',
        sport = 'Soccer',
        age_group = 'U15',
        gender = 'F'
    )

    t3 = Team(
        club_id = clubs[2].id,
        team_name = 'Warriors',
        sport = 'Basketball',
        age_group = 'U16',
        gender = 'M'
    )

    t4 = Team(
        club_id = clubs[3].id,
        team_name = 'Ravens',
        sport = 'Basketball',
        age_group = 'U16',
        gender = 'M'
    )

    teams.extend([t1, t2, t3, t4])

    return teams

def create_coaches(clubs):
    coaches = []

    coach = Coach(
        club = clubs[0],
        coach_name = fake.name(),
        email = fake.email(),
        password_hash = fake.password()
    )
    coaches.append(coach)

    for _ in range(2):
        coach = Coach(
            club = clubs[1],
            coach_name = fake.name(),
            email = fake.email(),
            password_hash = fake.password()
        )
        coaches.append(coach)
    
    return coaches

def create_players(teams):
    players = []

    for _ in range(16):
        player = Player(
            team = teams[0],
            player_name = fake.name_female(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password()
        )
        players.append(player)

    for _ in range(16):
        player = Player(
            team = teams[1],
            player_name = fake.name_female(),
            birthday = fake.date_of_birth(),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password()
        )
        players.append(player)

    return players

def create_events(teams, coaches):
    events_types = ["Practice", "Game", "Meeting"]
    duration_options = [1, 1.5, 2]

    events = []

    for _ in range(10):
        event = Event(
            team = teams[0],
            coach = coaches[0],
            event_type = rc(events_types),
            date = fake.future_date(),
            start_time = randint(1, 12),
            duration = rc(duration_options),
            location = fake.address()
        )
        events.append(event)

    for _ in range(5):
        event = Event(
            team = teams[1],
            coach = coaches[1],
            event_type = rc(events_types),
            date = fake.future_date(),
            start_time = randint(1, 12),
            duration = rc(duration_options),
            location = fake.address()
        )
        events.append(event)

    for _ in range(5):
        event = Event(
            team = teams[1],
            coach = coaches[2],
            event_type = rc(events_types),
            date = fake.future_date(),
            start_time = randint(1, 12),
            duration = rc(duration_options),
            location = fake.address()
        )
        events.append(event)

    return events

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        Team.query.delete()
        Event.query.delete()
        Coach.query.delete()
        Player.query.delete()
        Club.query.delete()

        print('Seeding clubs...')
        clubs = create_clubs()
        db.session.add_all(clubs)
        db.session.commit()

        print('Seeding teams...')
        teams = create_teams(clubs)
        db.session.add_all(teams)
        db.session.commit()

        print('Seeding coaches...')
        coaches = create_coaches(clubs)
        db.session.add_all(coaches)
        db.session.commit()

        print('Seeding players...')
        players = create_players(teams)
        db.session.add_all(players)
        db.session.commit()

        print('Seeding events...')
        events = create_events(teams, coaches)
        db.session.add_all(events)
        db.session.commit()

        print('Done seeding!')