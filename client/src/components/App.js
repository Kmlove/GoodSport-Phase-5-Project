import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
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

  // Needed when not using context for news article data
  // const [ sportsNewsArticles, setSportsNewsArticles ] = useState([])
  // console.log(sportsNewsArticles)
  // const randomIndex = Math.floor(Math.random() * sportsNewsArticles.length)
  // const randomNewsArticle = sportsNewsArticles[randomIndex]

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

  // News API but couldn't can only use in development not deployment
  // useEffect(() => {
  //   // fetch(`https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=${NEWS_API_KEY}`)
  //   fetch(`https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`)
  //   .then(res => res.json())
  //   .then(data => setSportsNewsArticles(data.articles))
  // }, [loggedInOrSignedUp])

  // News API to use in deployment if not using news context
  // useEffect(() => {
  //   fetch(`https://newsdata.io/api/1/news?apikey=${process.env.REACT_APP_NEWS_API_KEY_2}&country=us&language=en&category=sports`)
  //   .then(res => res.json())
  //   .then(data => setSportsNewsArticles(data.results))
  // }, [loggedInOrSignedUp])

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
