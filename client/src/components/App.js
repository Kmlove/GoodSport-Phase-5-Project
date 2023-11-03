import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import MainContainer from "./MainContainer";
import { LoggedOutContext } from "../context/loggedOut";
import { DeleteAlertContext } from "../context/deleteAccountAlert";

function App() {
  const [loggedInOrSignedUp, setLoggedInOrSignedUp] = useState(false)
  const [user, setUser] = useState('')
  const [showServerErrorAlert, setShowServerErrorAlert] = useState(false)
  const navigate = useNavigate()

  const [loggedOut, setLoggedOut] = useState(false)
  const [deletedAccountAlert, setDeletedAccountAlert] = useState(false)

  function handleChangeLoggedOutAlert(value){
    setLoggedOut(value)
  }

  function handleDeleteAccountAlert(value){
    setDeletedAccountAlert(value)
  }

  function handleLoginorSignUp(value){
    setLoggedInOrSignedUp(value)
  }

  function handleSetUser(user){
    setUser(user)
  }

  function handleUpdateUser(updatedUser){
    setUser(updatedUser)
  }

  function handleShowServerErrorAlert(value){
    setShowServerErrorAlert(value)
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

  // useEffect(() => {
  //   if (showServerErrorAlert) {
  //     // Use a setTimeout to hide the alert after 5 seconds
  //     const timer = setTimeout(() => {
  //       setShowServerErrorAlert(false);
  //     }, 5000); // 5000 milliseconds (5 seconds)

  //     // Clear the timer if the component unmounts
  //     return () => clearTimeout(timer);
  //   } 
  // }, [ showServerErrorAlert ]);

  return (
    <LoggedOutContext.Provider value={{loggedOut, handleChangeLoggedOutAlert}}>
      {loggedInOrSignedUp ? 
        <MainContainer handleLoginorSignUp={handleLoginorSignUp} user={user} handleUpdateUser={handleUpdateUser}/> : 
        (
          <>
            <header className="header">
              <h1 className="app-title">GoodSport</h1>
            </header>
            
            <Routes>
              <Route 
                path="/" 
                element={
                  <Login 
                    handleLoginorSignUp={handleLoginorSignUp} 
                    handleSetUser={handleSetUser}
                    showServerErrorAlert={showServerErrorAlert}
                    handleShowServerErrorAlert={handleShowServerErrorAlert}
                  />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <Signup 
                    handleLoginorSignUp={handleLoginorSignUp} 
                    handleSetUser={handleSetUser}
                    showServerErrorAlert={showServerErrorAlert}
                    handleShowServerErrorAlert={handleShowServerErrorAlert}
                  />
                } 
              />
            </Routes>
          </>
        )}  

    </LoggedOutContext.Provider>
  );
}

export default App;
