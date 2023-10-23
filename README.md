# GoodSport

## Description
GoodSport is a sports team management app that will allow users to be added to a team, and view all events (games, practices, meetings, etc..) that are associated with their team. Admin users (coaches and managers) can add, update and delete events. 

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
- Player has a parent_name
- Player has a team
- Player age falls within team age group
- Coach has a name and club_id
- Team has a club_id, age_group, and a unique name
- Event has a team_id, coach_id, type and start_time
- Club has a name that is unique
- All emails must contain an '@' symbol

## Wireframe
![GoodSport Landing Page Wireframe](./images/GoodSport%20Wireframe.png)

## Stretch Goals
- Tab for workout videos and drills that players can do
- An interapp message feature
- Users (Coaches and Players) can RSVP to events

## API Routes
- GET '/user'
- GET '/user/int:id'
- PATCH '/user/int:id'
- DELETE '/user/int:id'
- POST '/event'
- GET '/event'
- GET '/event/int:id'
- PATCH '/event/int:id'
- DELETE '/event/int:id'
- POST '/team'
- GET '/team'
- GET '/team/int:id'