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

headshots_female_players = ["https://images.squarespace-cdn.com/content/v1/5fde0871cb96363ef0b6b786/1609359712401-O4PFKIDAKRQ52LYQ6ND2/shoot-me-now-teenage-model-girl-headshot", "https://images.squarespace-cdn.com/content/v1/555bd2ece4b00127a2b1264f/1621047421406-16OADFQKV0U0MVJNVVVH/26_teen_youth_headshot_michael_verity_photography.jpg", "https://images.squarespace-cdn.com/content/v1/590814dc1e5b6c7f60b5e133/1507321982367-WWOUX9M3OSLT06AT4DCL/Girl+next+Door+copy.jpg?format=1000w", "https://frphoto.com/wp-content/uploads/2018/02/14-1149-post/Milwaukee-Headshot-Photographer_FRPhoto_170720A_C1_38.jpg", "https://i.pinimg.com/236x/cc/4a/6c/cc4a6c12fedb412d6e1f52ff691e6600.jpg"]
headshots_male_players = ["https://4.bp.blogspot.com/-NOYppoNXnoA/Vl0BnGtXEFI/AAAAAAABU1s/fanK3tscSYA/s1600/Actor%2Bheadshots_kids_teens_232.jpg", "https://i.pinimg.com/236x/01/22/91/012291480ee40fe3a424619b99c1f3bb.jpg", "https://2.bp.blogspot.com/-qgnJa1jD_YM/Vl0BlmzP32I/AAAAAAABU1g/qltyhBdTjUk/s1600/Actor%2Bheadshots_kids_teens_230.jpg", "https://i.pinimg.com/736x/e7/e0/8a/e7e08a14742970c38519fa66ab6e22ac.jpg", "https://tracywrightcorvo.com/wp-content/uploads/2019/02/Tracy_Wright_Corvo_Photography_teen_actor_headshot_male-087.jpg"]
headshots_female_coaches = ["https://images.squarespace-cdn.com/content/v1/5f4506ee3afb2b7624880125/1656426869152-0A0FYQ2BFKVIWA8PJOFA/working-mom-role.jpg", "https://beruckstudios.com/wp-content/uploads/bb-plugin/cache/CFO-Headshot-portrait.jpg"]
headshots_male_coaches = ["https://i.pinimg.com/236x/e8/7e/a5/e87ea5f1565b458bb866112909f1a62e.jpg", "https://images.squarespace-cdn.com/content/v1/624f4bb135fbf60489e1bccf/c97c249c-eef3-402f-bacb-de2e52e2d8be/Jay+Ellis+actor+headshotsjpgweb.jpg"]

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

    t5 = Team(
        club = clubs[0],
        team_name = 'Spirit',
        sport = 'Soccer',
        age_group = 'U16',
        gender = 'F'
    )

    t6 = Team(
        club = clubs[1],
        team_name = 'Eagles',
        sport = 'Soccer',
        age_group = 'U15',
        gender = 'F'
    )

    t7 = Team(
        club = clubs[2],
        team_name = 'Hawks',
        sport = 'Basketball',
        age_group = 'U16',
        gender = 'M'
    )

    t8 = Team(
        club = clubs[3],
        team_name = 'Firebirds',
        sport = 'Basketball',
        age_group = 'U16',
        gender = 'M'
    )

    t9 = Team(
        club = clubs[0],
        team_name = 'Wildcats',
        sport = 'Soccer',
        age_group = 'U14',
        gender = 'F'
    )

    t10 = Team(
        club = clubs[2],
        team_name = 'Flyers',
        sport = 'Basketball',
        age_group = 'U17',
        gender = 'M'
    )

    teams.extend([t1, t2, t3, t4, t5, t6, t7, t8, t9, t10])

    return teams

def create_coaches(clubs):
    coaches = []

    coach = Coach(
        club = clubs[0],
        coach_name = fake.name_male(),
        email = fake.email(),
        password_hash = fake.password(),
        phone_number = fake.numerify(text='##########'),
        headshot_img_url = rc(headshots_male_coaches)
    )
    coaches.append(coach)

    for _ in range(2):
        coach = Coach(
            club = clubs[1],
            coach_name = fake.name(),
            email = fake.email(),
            password_hash = fake.password(),
            phone_number = fake.numerify(text='##########')
        )
        coaches.append(coach)

    kim = Coach(
        club = clubs[0],
        coach_name = "Kim Love",
        email = "kim1@email.com",
        password_hash = "Password1",
        phone_number = fake.numerify(text='##########')
    )
    coaches.append(kim)

    for _ in range(3):
        coach = Coach(
            club = clubs[2],
            coach_name = fake.name(),
            email = fake.email(),
            password_hash = fake.password(),
            phone_number = fake.numerify(text='##########')
        )
        coaches.append(coach)

    for _ in range(3):
        coach = Coach(
            club = clubs[3],
            coach_name = fake.name_female(),
            email = fake.email(),
            password_hash = fake.password(),
            phone_number = fake.numerify(text='##########'),
            headshot_img_url = rc(headshots_female_coaches)
        )
        coaches.append(coach)
    
    return coaches

def create_players(teams):
    players = []

    for _ in range(8):
        player = Player(
            team = teams[0],
            player_name = fake.name_female(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "F",
            parent_phone_number = fake.numerify(text='##########'),
            jersey_num = randint(0,99),
            headshot_img_url = rc(headshots_female_players)
        )
        players.append(player)

    for _ in range(8):
        player = Player(
            team = teams[0],
            player_name = fake.name_female(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "F",
            parent_phone_number = fake.numerify(text='##########'),
            jersey_num = randint(0,99),
        )
        players.append(player)

    for _ in range(8):
        player = Player(
            team = teams[4],
            player_name = fake.name_female(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "F",
            parent_phone_number = fake.numerify(text='##########'),
            jersey_num = randint(0,99),
            headshot_img_url = rc(headshots_female_players)
        )
        players.append(player)

    for _ in range(8):
        player = Player(
            team = teams[4],
            player_name = fake.name_female(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "F",
            parent_phone_number = fake.numerify(text='##########'),
            jersey_num = randint(0,99)
        )
        players.append(player)

    player = Player(
        team = teams[0],
        player_name = "Ruby Jones",
        birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
        parent_name = "Holly Jones",
        parent_email = "holly1@email.com",
        password_hash = "Password1",
        gender = "F",
        parent_phone_number = fake.numerify(text='##########'),
        jersey_num = randint(0,99)
    )
    players.append(player)

    for _ in range(8):
        player = Player(
            team = teams[2],
            player_name = fake.name_male(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "M",
            parent_phone_number = fake.numerify(text='##########'),
            jersey_num = randint(0,99),
            headshot_img_url = rc(headshots_male_players)
        )
        players.append(player)

    for _ in range(8):
        player = Player(
            team = teams[2],
            player_name = fake.name_male(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "M",
            parent_phone_number = fake.numerify(text='##########'),
            jersey_num = randint(0,99)
        )
        players.append(player)

    for _ in range(8):
        player = Player(
            team = teams[6],
            player_name = fake.name_male(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "M",
            parent_phone_number = fake.numerify(text='##########'),
            jersey_num = randint(0,99),
            headshot_img_url = rc(headshots_male_players)
        )
        players.append(player)

    for _ in range(8):
        player = Player(
            team = teams[6],
            player_name = fake.name_male(),
            birthday = fake.date_between_dates(date_start=datetime(2009, 1, 1), date_end=datetime(2009, 12, 31)),
            parent_name = fake.name(),
            parent_email = fake.email(),
            password_hash = fake.password(),
            gender = "M",
            parent_phone_number = fake.numerify(text='##########'),
            jersey_num = randint(0,99)
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
            # date = fake.future_date(),
            date = fake.date_between_dates(date_start=datetime(2023, 10, 1), date_end=datetime(2024, 2, 1)),
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
            # date = fake.future_date(),
            date = fake.date_between_dates(date_start=datetime(2023, 10, 1), date_end=datetime(2024, 2, 1)),
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
            team = teams[4],
            coach = coaches[3],
            event_type = rc(events_types),
            # date = fake.future_date(),
            date = fake.date_between_dates(date_start=datetime(2023, 10, 1), date_end=datetime(2024, 2, 1)),
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
            # date = fake.future_date(),
            date = fake.date_between_dates(date_start=datetime(2023, 10, 1), date_end=datetime(2024, 2, 1)),
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
            # date = fake.future_date(),
            date = fake.date_between_dates(date_start=datetime(2023, 10, 1), date_end=datetime(2024, 2, 1)),
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
            team = teams[2],
            coach = coaches[4],
            event_type = rc(events_types),
            # date = fake.future_date(),
            date = fake.date_between_dates(date_start=datetime(2023, 10, 1), date_end=datetime(2024, 2, 1)),
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
            team = teams[2],
            coach = coaches[6],
            event_type = rc(events_types),
            # date = fake.future_date(),
            date = fake.date_between_dates(date_start=datetime(2023, 10, 1), date_end=datetime(2024, 2, 1)),
            event_time = new_time1 + " - " + new_time2,
            notes = fake.sentence(nb_words=10),
            location = fake.address()
        )
        events.append(event)

    for _ in range(12):
        time1 = fake.time()
        new_time1 = time1[:-3] + " pm"

        time2 = fake.time()
        new_time2 = time2[:-3] + " pm"

        event = Event(
            team = teams[3],
            coach = coaches[8],
            event_type = rc(events_types),
            # date = fake.future_date(),
            date = fake.date_between_dates(date_start=datetime(2023, 10, 1), date_end=datetime(2024, 2, 1)),
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
        Event.query.delete()
        Player.query.delete()
        Team.query.delete()
        Coach.query.delete()
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