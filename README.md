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