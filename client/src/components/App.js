import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Home from "./Home";
import TeamsList from "./TeamsList";
import PlayersList from "./PlayersList";
import Schedule from "./Schedule";
import Account from "./Account";

function App() {
  return (
    <div>
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={''} />
        <Route path="/home" element={<Home />} />
        <Route path="/teams" element={<TeamsList />} />
        <Route path="/players" element={<PlayersList />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
