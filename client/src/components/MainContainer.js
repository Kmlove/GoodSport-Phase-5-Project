import React, { useEffect, useState, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Home from "./Home";
import TeamsList from "./TeamsList";
import Schedule from "./Schedule";
import Account from "./Account";
import EventForm from "./EventForm"
import Event from "./Event";
import Team from "./Team";
import Player from "./Player";
import { DeleteAlertContext } from "../context/deleteAccountAlert";

function MainContainer({handleLoginorSignUp, user, handleUpdateUser, newsArticle}) {
    const [ events, setEvents ] = useState([])
    const [ teams, setTeams ] = useState([])
    const [ filterScheduleEventsValue, setFilterScheduleEventsValue ] = useState(0)
    const [ futureEventsCheck, setFutureEventsCheck ] = useState(true)
    const [ showSuccessfulDeleteAlert, setShowSuccessfulDeleteAlert ] = useState(false)
    const [ showErrorDeleteAlert, setShowErrorDeleteAlert ] = useState(false)
    const [ showSuccessfulAddAlert, setShowSuccessfulAddAlert ] = useState(false)
    const [ deleteError, setDeleteError ] = useState(false)
    const mainContainer = document.querySelector('#mainPageContainer')
    const popup = document.querySelector('#delete-account-popup')
    const navigate = useNavigate()
    const { handleDeleteAccountAlert } = useContext(DeleteAlertContext)
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

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

    useEffect(() => {
        const handleResize = () => {
          setViewportWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

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
        
        fetch(`/coaches/${user.id}`)
        .then(res => res.json())
        .then(data => handleUpdateUser(data))

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

    function handleSetFilterScheduleEventsValue(value){
        setFilterScheduleEventsValue(value)
    }

    function handleFutureEventsCheck(value){
        setFutureEventsCheck(value)
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
                    handleDeleteAccountAlert(true)
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
                    handleDeleteAccountAlert(true)
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
        let futureEventsCoach
        let futureEventsPlayer

        if(futureEventsCheck && user.is_admin){
            futureEventsCoach = events.filter(event => {
                const today = new Date();
                let currDay = today.getDate().toString().length === 1 ? `0${today.getDate()}` : today.getDate();
                let currMonth = (today.getMonth() + 1).toString().length === 1 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
                const currYear = today.getFullYear();
                const eventYear = parseInt(event.date.slice(0, 4), 10); // Convert to an integer
                const eventMonth = parseInt(event.date.slice(5, 7), 10); // Convert to an integer
                const eventDay = parseInt(event.date.slice(8, 10), 10); // Convert to an integer
                currDay = typeof(currDay) === 'number'? currDay : parseInt(currDay, 10)
                currMonth = typeof(currMonth) === 'number'? currMonth : parseInt(currMonth, 10)
              
                if (eventYear > currYear || (eventYear === currYear && eventMonth > currMonth)) {
                  return true;
                } else if (eventYear === currYear && eventMonth === currMonth && eventDay >= currDay) {
                  return true;
                } else {
                  return false;
                }
            })
        }

        if(futureEventsCheck && user.is_admin === false){
            futureEventsPlayer = user.team.events.filter(event => {
                const today = new Date();
                let currDay = today.getDate().toString().length === 1 ? `0${today.getDate()}` : today.getDate();
                let currMonth = (today.getMonth() + 1).toString().length === 1 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
                const currYear = today.getFullYear();
                const eventYear = parseInt(event.date.slice(0, 4), 10); // Convert to an integer
                const eventMonth = parseInt(event.date.slice(5, 7), 10); // Convert to an integer
                const eventDay = parseInt(event.date.slice(8, 10), 10);
                currDay = typeof(currDay) === 'number'? currDay : parseInt(currDay, 10)
                currMonth = typeof(currMonth) === 'number'? currMonth : parseInt(currMonth, 10)
                
                if (eventYear > currYear || (eventYear === currYear && eventMonth > currMonth)) {
                  return true;
                } else if (eventYear === currYear && eventMonth === currMonth && eventDay >= currDay) {
                  return true;
                } else {
                  return false;
                }
            })
        }

        if(user.is_admin === true){
            eventsToDisplay = futureEventsCheck? futureEventsCoach.filter(event => event.coach_id === user.id).sort(compareEventsByDate): events.filter(event => event.coach_id === user.id).sort(compareEventsByDate)

            if (filterScheduleEventsValue !== 0){
                eventsToDisplay = futureEventsCheck? futureEventsCoach.filter(event => event.coach_id === user.id).sort(compareEventsByDate).filter(event => event.team_id === filterScheduleEventsValue): events.filter(event => event.coach_id === user.id).sort(compareEventsByDate).filter(event => event.team_id === filterScheduleEventsValue)
            }

        } else if (user.is_admin === false){
            eventsToDisplay = futureEventsCheck? futureEventsPlayer.sort(compareEventsByDate) : user.team.events.sort(compareEventsByDate)
        }
        
        const homePageEvents = user.is_admin ? events.filter(event => event.coach_id === user.id).sort(compareEventsByDate) : user.team.events.sort(compareEventsByDate)

      return (
        <div id="pageContainer">
            <div id="delete-account-popup" className="hidden">
                <p>Are you sure you want to delete your account?</p>
                <div id="popup-buttons-container">
                    <button onClick={handleYesClick} className="popup-button">YES</button>
                    <button onClick={handleNoClick} className="popup-button">NO</button>
                </div>
            </div>

            <Header 
                viewportWidth={viewportWidth}
                handleSetFilterScheduleEventsValue={handleSetFilterScheduleEventsValue} 
                handleFutureEventsCheck={handleFutureEventsCheck} 
            />
            <div id="mainPageContainer">
                <NavBar 
                    handleSetFilterScheduleEventsValue={handleSetFilterScheduleEventsValue} 
                    user={user}
                    handleFutureEventsCheck={handleFutureEventsCheck}
                    viewportWidth={viewportWidth}
                />
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <Home 
                                events={homePageEvents} 
                                user={user} 
                                teams={teams}
                                handleDeleteEvent={handleDeleteEvent} 
                                handleShowSuccessfulDeleteAlert={handleShowSuccessfulDeleteAlert}
                                handleShowErrorDeleteAlert={handleShowErrorDeleteAlert}
                                showSuccessfulDeleteAlert={showSuccessfulDeleteAlert}
                                showErrorDeleteAlert={showErrorDeleteAlert}
                                newsArticle={newsArticle}
                            />
                        } 
                    />
                    <Route 
                        path="/home" 
                        element={
                            <Home 
                                events={homePageEvents} 
                                user={user} 
                                teams={teams}
                                handleDeleteEvent={handleDeleteEvent} 
                                handleShowSuccessfulDeleteAlert={handleShowSuccessfulDeleteAlert}
                                handleShowErrorDeleteAlert={handleShowErrorDeleteAlert}
                                showSuccessfulDeleteAlert={showSuccessfulDeleteAlert}
                                showErrorDeleteAlert={showErrorDeleteAlert}
                                newsArticle={newsArticle}
                            />
                        } 
                    />
                    <Route 
                        path="/team" 
                        element={
                            <TeamsList 
                                user={user}
                                teams={teams}
                            />
                        } 
                    />
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
                                handleSetFilterScheduleEventsValue={handleSetFilterScheduleEventsValue}
                                handleFutureEventsCheck={handleFutureEventsCheck}
                                futureEventsCheck={futureEventsCheck} 
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
                    <Route
                        path="/team/:id"
                        element={<Team />}
                    />
                    <Route
                        path="/player/:id"
                        element={<Player />}
                    />
                </Routes>
            </div>
        </div>
      )
    }

}

export default MainContainer