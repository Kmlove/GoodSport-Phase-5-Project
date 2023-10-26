import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import MainContainer from "./MainContainer";

function App() {
  const [loggedInOrSignedUp, setLoggedInOrSignedUp] = useState(false)
  const [user, setUser] = useState(null)

  function handleLoginorSignUp(){
    setLoggedInOrSignedUp(!loggedInOrSignedUp)
  }

  function handleSetUser(user){
    setUser(user)
  }

  useEffect(() => {
    fetch('/auto_login')
      .then((res) => res.json())
      .then((data) => {
        setUser(data)
        handleLoginorSignUp()
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div >
      {loggedInOrSignedUp ? 
        <MainContainer handleLoginorSignUp={handleLoginorSignUp}/> : 
        (
          <Routes>
            <Route path="/" element={<Login handleLoginorSignUp={handleLoginorSignUp} handleSetUser={handleSetUser}/>} />
            <Route path="/signup" element={<Signup handleLoginorSignUp={handleLoginorSignUp} handleSetUser={handleSetUser}/>} />
          </Routes>
        )}  

    </div>
  );
}

export default App;
