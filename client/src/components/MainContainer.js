import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Home from "./Home";
import TeamsList from "./TeamsList";
import PlayersList from "./PlayersList";
import Schedule from "./Schedule";
import Account from "./Account";

function MainContainer({handleLoginorSignUp, user}) {
    const [events, setEvents] = useState([])
    console.log(user)

    useEffect(() => {
        fetch('/events')
        .then(res => res.json())
        .then(events => setEvents(events))
    }, [])

    if(user === undefined){
        return <h3>Loading...</h3>
    } else {
    
        let eventsToDisplay
        if(user.is_admin === true){
            eventsToDisplay = events.filter(event => event.coach_id === user.id)
        }
        
    
      return (
        <>
            <Header />
            <div className="mainPageContainer">
                <NavBar />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/teams" element={<TeamsList />} />
                    <Route path="/players" element={<PlayersList />} />
                    <Route path="/schedule" element={<Schedule events={eventsToDisplay} />} />
                    <Route path="/account" element={<Account handleLoginorSignUp={handleLoginorSignUp} />} />
                </Routes>
            </div>
        </>
      )
    }

}

export default MainContainer