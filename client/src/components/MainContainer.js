import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Home from "./Home";
import TeamsList from "./TeamsList";
import PlayersList from "./PlayersList";
import Schedule from "./Schedule";
import Account from "./Account";
import EventForm from "./EventForm"
import Event from "./Event";

function MainContainer({handleLoginorSignUp, user}) {
    const [events, setEvents] = useState([])
    const [teams, setTeams] = useState([])

    useEffect(() => {
        fetch('/events')
        .then(res => res.json())
        .then(events => setEvents(events))
    }, [])

    useEffect(() => {
        fetch('/teams')
        .then(res => res.json())
        .then(teams => setTeams(teams))
    }, [])

    function addNewEvent(new_event){
        setEvents([...events, new_event])
    }

    if(user === undefined){
        return <h3>Loading...</h3>
    } else {
    
        let eventsToDisplay
    
        if(user.is_admin === true){
            eventsToDisplay = events.filter(event => event.coach_id === user.id)
        } else if (user.is_admin === false){
            eventsToDisplay = user.team.events
        }
        
      return (
        <>
            <Header />
            <div className="mainPageContainer">
                <NavBar user={user}/>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/teams" element={<TeamsList />} />
                    <Route path="/players" element={<PlayersList />} />
                    <Route path="/schedule" element={<Schedule teams={teams} events={eventsToDisplay} user={user}/>} />
                    <Route path="/account" element={<Account handleLoginorSignUp={handleLoginorSignUp} />} />
                    <Route path="/event/new" element={<EventForm user={user} teams={teams} addNewEvent={addNewEvent}/>}/>
                    <Route path="/event/:id" element={<Event />} />
                </Routes>
            </div>
        </>
      )
    }

}

export default MainContainer