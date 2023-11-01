#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from config import db, app
from models.team import Team
from models.event import Event
from models.coach import Coach
from models.player import Player
from models.club import Club

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
        club = clubs[2],
        team_name = 'Warriors',
        sport = 'Basketball',
        age_group = 'U16',
        gender = 'M'
    )

    t4 = Team(
        club = clubs[3],
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

    kim = Coach(
        club = clubs[0],
        coach_name = "Kim Love",
        email = "kim1@email.com",
        password_hash = "Password1"
    )
    coaches.append(kim)
    
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
            password_hash = fake.password(),
            gender = "F"
        )
        players.append(player)

    for _ in range(16):
        player = Player(
            team = teams[1],
            player_name = fake.name_female(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "F"
        )
        players.append(player)

    player = Player(
        team = teams[0],
        player_name = "Ruby Atha",
        birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
        parent_name = "Holly Atha",
        parent_email = "holly1@email.com",
        password_hash = "Password1",
        gender = "F"
    )
    players.append(player)

    return players

def create_events(teams, coaches):
    events_types = ["Practice", "Game", "Meeting", "Other"]

    events = []

    for _ in range(10):
        time1 = fake.time()
        new_time1 = time1[:-3] + " pm"

        time2 = fake.time()
        new_time2 = time2[:-3] + " pm"

        event = Event(
            team = teams[0],
            coach = coaches[0],
            event_type = rc(events_types),
            date = fake.future_date(),
            event_time = new_time1 + " - " + new_time2,
            notes = fake.sentence(nb_words=10),
            location = fake.address()
        )
        events.append(event)

    for _ in range(10):
        time1 = fake.time()
        new_time1 = time1[:-3] + " pm"

        time2 = fake.time()
        new_time2 = time2[:-3] + " pm"

        event = Event(
            team = teams[0],
            coach = coaches[3],
            event_type = rc(events_types),
            date = fake.future_date(),
            event_time = new_time1 + " - " + new_time2,
            notes = fake.sentence(nb_words=10),
            location = fake.address()
        )
        events.append(event)

    for _ in range(6):
        time1 = fake.time()
        new_time1 = time1[:-3] + " pm"

        time2 = fake.time()
        new_time2 = time2[:-3] + " pm"

        event = Event(
            team = teams[1],
            coach = coaches[1],
            event_type = rc(events_types),
            date = fake.future_date(),
            event_time = new_time1 + " - " + new_time2,
            notes = fake.sentence(nb_words=10),
            location = fake.address()
        )
        events.append(event)

    for _ in range(6):
        time1 = fake.time()
        new_time1 = time1[:-3] + " pm"

        time2 = fake.time()
        new_time2 = time2[:-3] + " pm"

        event = Event(
            team = teams[1],
            coach = coaches[2],
            event_type = rc(events_types),
            date = fake.future_date(),
            event_time = new_time1 + " - " + new_time2,
            notes = fake.sentence(nb_words=10),
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