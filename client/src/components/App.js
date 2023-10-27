import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import MainContainer from "./MainContainer";

function App() {
  const [loggedInOrSignedUp, setLoggedInOrSignedUp] = useState(false)
  const [user, setUser] = useState('')

  function handleLoginorSignUp(value){
    setLoggedInOrSignedUp(value)
  }

  function handleSetUser(user){
    setUser(user)
  }

  useEffect(() => {
    fetch('/auto_login')
      .then((res) => {
        if (res.status === 401 || res.status === 404 || res.status === 500){
          return Promise.reject('User Not Authorized')
        }
        else {
          return res.json()
        }
      })
      .then((data) => {
        setUser(data)
        handleLoginorSignUp(true)
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div >
      {loggedInOrSignedUp ? 
        <MainContainer handleLoginorSignUp={handleLoginorSignUp} user={user}/> : 
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
