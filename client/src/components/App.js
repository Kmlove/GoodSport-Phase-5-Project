import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Home from "./Home";
import TeamsList from "./TeamsList";
import PlayersList from "./PlayersList";
import Schedule from "./Schedule";
import Account from "./Account";
import Signup from "./Signup";
import Login from "./Login";

function App() {
  const [loggedInOrSignedUp, setLoggedInOrSignedUp] = useState(true)

  return (
    <div >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {loggedInOrSignedUp && (
        <>
          <Header />
          <div className="mainPageContainer">
            <NavBar />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/teams" element={<TeamsList />} />
              <Route path="/players" element={<PlayersList />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
