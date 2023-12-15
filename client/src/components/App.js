import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import MainContainer from "./MainContainer";
import { LoggedOutContext } from "../context/loggedOut";
import { DeleteAlertContext } from "../context/deleteAccountAlert";
import sportsBalls from "../IMAGES/photo-sports-balls.jpg"
// import { NEWS_API_KEY } from "../apikeys";

function App() {
  const [loggedInOrSignedUp, setLoggedInOrSignedUp] = useState(false)
  const [user, setUser] = useState('')
  const [showServerErrorAlert, setShowServerErrorAlert] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  const [deletedAccountAlert, setDeletedAccountAlert] = useState(false)
  const navigate = useNavigate()

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
        // navigate('/home')
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <DeleteAlertContext.Provider value={{deletedAccountAlert, handleDeleteAccountAlert}}>
      <LoggedOutContext.Provider value={{loggedOut, handleChangeLoggedOutAlert}}>
        {loggedInOrSignedUp ? 
          <MainContainer 
            handleLoginorSignUp={handleLoginorSignUp} 
            user={user} 
            handleUpdateUser={handleUpdateUser}
            // newsArticle={randomNewsArticle}
          /> 
          :(
            <>
              <header className="header-login">
                <img className="logo" src={sportsBalls} alt="Sports Balls Array" />
                <h1 className="app-title"><span className="good">Good</span><span className="sport">Sport</span></h1>
                <img className="logo" src={sportsBalls} alt="Sports Balls Array" />
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
    </DeleteAlertContext.Provider >
  );
}

export default App;
