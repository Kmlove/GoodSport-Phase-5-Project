import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Home from "./Home";
import TeamsList from "./TeamsList";
import PlayersList from "./PlayersList";
import Schedule from "./Schedule";
import Account from "./Account";

function MainContainer({handleLoginorSignUp}) {
    const [events, setEvents] = useState([])

    useEffect(() => {
        fetch('/events')
        .then(res => res.json())
        .then(events => setEvents(events))
    }, [])

    const eventsToDisplay = events.filter(event => event.coach_id = 1)

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

export default MainContainer