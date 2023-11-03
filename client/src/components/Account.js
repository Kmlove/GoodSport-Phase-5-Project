import CoachAccount from "./CoachAccount"
import PlayerAccount from "./PlayerAccount"
import { Alert } from 'antd';
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedOutContext } from "../context/loggedOut";

function Account({handleLoginorSignUp, user, handleUpdateUser, mainContainer, popup, deleteError}) {

    const navigate = useNavigate()
    const container = document.querySelector(".right")
    const [ successfulUpdate, setSuccessfulUpdate ] = useState(false)
    const [ passwordError, setPasswordError ] = useState(false)
    const [ serverError, setServerError ] = useState(false)
    const { handleChangeLoggedOutAlert } = useContext(LoggedOutContext)

    useEffect(() => {
        if (successfulUpdate) {
          // Use a setTimeout to hide the alert after 3 seconds
          const timer = setTimeout(() => {
            setSuccessfulUpdate(false);
          }, 3000); // 3000 milliseconds (3 seconds)
    
          // Clear the timer if the component unmounts
          return () => clearTimeout(timer);
        } else if (passwordError) {
          // Use a setTimeout to hide the alert after 6 seconds
          const timer = setTimeout(() => {
            setPasswordError(false);
          }, 6000); // 6000 milliseconds (6 seconds)
    
          // Clear the timer if the component unmounts
          return () => clearTimeout(timer);
        } else if (serverError) {
          // Use a setTimeout to hide the alert after 6 seconds
          const timer = setTimeout(() => {
            setServerError(false);
          }, 6000); // 6000 milliseconds (6 seconds)
    
          // Clear the timer if the component unmounts
          return () => clearTimeout(timer);
        }
      }, [successfulUpdate, passwordError, serverError ]);

    function handleSucessfulUpdate(value){
        setSuccessfulUpdate(value)
    }

    function handlePasswordError(value){
        setPasswordError(value)
    }

    function handleServerError(value){
        setServerError(value)
    }

    function handleLogoutClick(e){
        fetch('/logout', {
          method: "DELETE",
        })
        .then(() => {
          handleChangeLoggedOutAlert(true)
          handleLoginorSignUp(false)
          navigate('/')
        })
      }
    
      function handleDeleteAccount(e){
        mainContainer.classList.add("blur")
        popup.classList.remove("hidden")
      }

  return (
    <div className="right">
        <h2 className="containerHeaders">Account Information</h2>
        <div id="account-buttons-container">
          <button onClick={handleLogoutClick} className="account-button">Log Out</button>
          <button onClick={handleDeleteAccount} className="account-button">Delete Account</button>
        </div>

        {successfulUpdate? <Alert message="Account Successfully Updated!" type="success" banner showIcon className="alert"/> : null}
        {passwordError? <Alert message="The current password you entered did not match what we have on file, please try again." type="error" banner  showIcon className="alert"/> : null}
        {serverError? <Alert message="There was an error updating your account, please try again later!" type="error" banner showIcon className="alert"/> : null}
        {deleteError? <Alert message="There was an error deleting your account, please try again later!" type="error" banner showIcon className="alert"/> : null}

        {user.is_admin? (
            <CoachAccount 
                user={user} 
                handleUpdateUser={handleUpdateUser}
                handleServerError={handleServerError}
                handlePasswordError={handlePasswordError}
                handleSucessfulUpdate={handleSucessfulUpdate}
                container={container}
            />
        ) : (
            <PlayerAccount 
                user={user} 
                handleUpdateUser={handleUpdateUser}
                handleServerError={handleServerError}
                handlePasswordError={handlePasswordError}
                handleSucessfulUpdate={handleSucessfulUpdate}
                container={container}
            />
        )
    }
    </div>
  )
}

export default Account