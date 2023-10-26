import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import MainContainer from "./MainContainer";

function App() {
  const [loggedInOrSignedUp, setLoggedInOrSignedUp] = useState(true)

  return (
    <div >
      {/* <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes> */}

      {loggedInOrSignedUp && <MainContainer /> }  

    </div>
  );
}

export default App;
