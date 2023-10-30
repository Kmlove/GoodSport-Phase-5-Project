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
    const [showSuccessfulDeleteAlert, setShowSuccessfulDeleteAlert] = useState(false)
    const [showErrorDeleteAlert, setShowErrorDeleteAlert] = useState(true)

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

    function handleShowSuccessfulDeleteAlert(value){
        setShowSuccessfulDeleteAlert(value)
    }

    function handleShowErrorDeleteAlert(value){
        setShowErrorDeleteAlert(value)
    }

    function addNewEvent(new_event){
        setEvents([...events, new_event])
    }

    function handleDeleteEvent(deletedEvent){
        const updatedEvents = events.filter(event => event.id !== deletedEvent.id)
        setEvents(updatedEvents)
    }

    function handleUpdateEvent(updatedEvent){
        updatedEvent.coach_id = updatedEvent.coach.id
        updatedEvent.team_id = updatedEvent.team.id
        const updatedEvents = events.map(event => {
            if (event.id === updatedEvent.id){
                return updatedEvent
            } else {
                return event
            }
        })
        setEvents(updatedEvents)  
    }

    // To sort 'events' array by the 'date' attribute in ascending order
    function compareEventsByDate(eventA, eventB) {
        const dateA = new Date(eventA.date);
        const dateB = new Date(eventB.date);
        return dateA - dateB;
    }

    if(user === undefined){
        return <h3>Loading...</h3>
    } else {
    
        let eventsToDisplay
        if(user.is_admin === true){
            eventsToDisplay = events.filter(event => event.coach_id === user.id).sort(compareEventsByDate)
        } else if (user.is_admin === false){
            eventsToDisplay = user.team.events.sort(compareEventsByDate)
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
                    <Route path="/schedule" element={<Schedule teams={teams} events={eventsToDisplay} user={user} handleDeleteEvent={handleDeleteEvent} handleShowSuccessfulDeleteAlert={handleShowSuccessfulDeleteAlert} showSuccessfulDeleteAlert={showSuccessfulDeleteAlert} showErrorDeleteAlert={showErrorDeleteAlert} handleShowErrorDeleteAlert={handleShowErrorDeleteAlert} />} />
                    <Route path="/account" element={<Account handleLoginorSignUp={handleLoginorSignUp} />} />
                    <Route path="/event/new" element={<EventForm user={user} teams={teams} addNewEvent={addNewEvent}/>}/>
                    <Route path="/event/:id" element={<Event handleDeleteEvent={handleDeleteEvent} handleUpdateEvent={handleUpdateEvent} user={user} handleShowSuccessfulDeleteAlert={handleShowSuccessfulDeleteAlert} handleShowErrorDeleteAlert={handleShowErrorDeleteAlert}/>} />
                </Routes>
            </div>
        </>
      )
    }

}

export default MainContainer