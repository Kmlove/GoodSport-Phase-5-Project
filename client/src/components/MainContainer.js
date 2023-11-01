import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Home from "./Home";
import TeamsList from "./TeamsList";
import PlayersList from "./PlayersList";
import Schedule from "./Schedule";
import Account from "./Account";
import EventForm from "./EventForm"
import Event from "./Event";

function MainContainer({handleLoginorSignUp, user, handleUpdateUser}) {
    const [events, setEvents] = useState([])
    const [teams, setTeams] = useState([])
    const [showSuccessfulDeleteAlert, setShowSuccessfulDeleteAlert] = useState(false)
    const [showErrorDeleteAlert, setShowErrorDeleteAlert] = useState(false)
    const [showSuccessfulAddAlert, setShowSuccessfulAddAlert] = useState(false)
    const [ deleteError, setDeleteError ] = useState(false)
    const mainContainer = document.querySelector('.mainPageContainer')
    const popup = document.querySelector('#delete-account-popup')
    const navigate = useNavigate()

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

    useEffect(() => {
        if (showSuccessfulDeleteAlert) {
          // Use a setTimeout to hide the alert after 3 seconds
          const timer = setTimeout(() => {
            setShowSuccessfulDeleteAlert(false);
          }, 3000); // 3000 milliseconds (3 seconds)
    
          // Clear the timer if the component unmounts
          return () => clearTimeout(timer);
        } else if (showErrorDeleteAlert) {
            // Use a setTimeout to hide the alert after 3 seconds
            const timer = setTimeout(() => {
              handleShowErrorDeleteAlert(false);
            }, 3000); // 3000 milliseconds (3 seconds)
      
            // Clear the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [ showSuccessfulDeleteAlert, showErrorDeleteAlert ]);

    function handleShowSuccessfulAddAlert(value){
        setShowSuccessfulAddAlert(value)
    }

    function handleShowSuccessfulDeleteAlert(value){
        setShowSuccessfulDeleteAlert(value)
    }

    function handleShowErrorDeleteAlert(value){
        setShowErrorDeleteAlert(value)
    }

    function addNewEvent(new_event){
        new_event.coach_id = new_event.coach.id
        new_event.team_id = new_event.team.id
        delete new_event.coach
        delete new_event.team
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

    function handleNoClick(e){
        mainContainer.classList.remove("blur")
        popup.classList.add("hidden")
    }

    function handleYesClick(e){
        if (user.is_admin){
            fetch(`coaches/${user.id}`, {
                method: "DELETE"
            })
            .then((res) => {
                if (res.status === 204){
                    popup.classList.add("hidden")
                    mainContainer.classList.remove("blurr")
                    handleLoginorSignUp(false)
                    navigate('/')
                }
                else {
                    setDeleteError(true)
                    popup.classList.add("hidden")
                    mainContainer.classList.remove("blurr")
                    return Promise.reject("Error deleting account")
                }
            })
        } else {
            fetch(`players/${user.id}`, {
                method: "DELETE"
            })
            .then((res) => {
                if (res.status === 204){
                    popup.classList.add("hidden")
                    mainContainer.classList.remove("blurr")
                    handleLoginorSignUp(false)
                    navigate('/')
                }
                else {
                    setDeleteError(true)
                    popup.classList.add("hidden")
                    mainContainer.classList.remove("blurr")
                    return Promise.reject("Error deleting account")
                }
            })
        }

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
            <div id="delete-account-popup" className="hidden">
                <p>Are you sure you want to delete your account?</p>
                <button onClick={handleYesClick}>YES</button>
                <button onClick={handleNoClick}>NO</button>
            </div>

            <Header />
            <div className="mainPageContainer">
                <NavBar user={user}/>
                <Routes>
                    <Route 
                        path="/home" 
                        element={
                            <Home 
                                events={eventsToDisplay} 
                                user={user} 
                                teams={teams}
                                handleDeleteEvent={handleDeleteEvent} 
                                handleShowSuccessfulDeleteAlert={handleShowSuccessfulDeleteAlert}
                                handleShowErrorDeleteAlert={handleShowErrorDeleteAlert}
                                showSuccessfulDeleteAlert={showSuccessfulDeleteAlert}
                                showErrorDeleteAlert={showErrorDeleteAlert}
                            />
                        } 
                    />
                    <Route path="/teams" element={<TeamsList />} />
                    <Route path="/players" element={<PlayersList />} />
                    <Route 
                        path="/schedule" 
                        element={
                            <Schedule 
                                teams={teams} 
                                events={eventsToDisplay} 
                                user={user} 
                                handleDeleteEvent={handleDeleteEvent} 
                                handleShowSuccessfulDeleteAlert={handleShowSuccessfulDeleteAlert} 
                                showSuccessfulDeleteAlert={showSuccessfulDeleteAlert} 
                                showErrorDeleteAlert={showErrorDeleteAlert} 
                                handleShowErrorDeleteAlert={handleShowErrorDeleteAlert} 
                            />
                        } 
                    />
                    <Route 
                        path="/account" 
                        element={
                            <Account 
                                handleLoginorSignUp={handleLoginorSignUp} 
                                user={user} 
                                handleUpdateUser={handleUpdateUser}
                                mainContainer={mainContainer}
                                popup={popup}
                                deleteError={deleteError}
                            />
                        } 
                    />
                    <Route 
                        path="/event/new" 
                        element={
                            <EventForm 
                                user={user} 
                                teams={teams} 
                                addNewEvent={addNewEvent} 
                                handleShowSuccessfulAddAlert={handleShowSuccessfulAddAlert}
                            />
                        }
                    />
                    <Route 
                        path="/event/:id" 
                        element={
                            <Event 
                                handleDeleteEvent={handleDeleteEvent} 
                                handleUpdateEvent={handleUpdateEvent} 
                                user={user} 
                                handleShowSuccessfulDeleteAlert={handleShowSuccessfulDeleteAlert} 
                                handleShowErrorDeleteAlert={handleShowErrorDeleteAlert}
                                handleShowSuccessfulAddAlert={handleShowSuccessfulAddAlert}
                                showSuccessfulAddAlert={showSuccessfulAddAlert}
                            />
                        } 
                    />
                </Routes>
            </div>
        </>
      )
    }

}

export default MainContainer