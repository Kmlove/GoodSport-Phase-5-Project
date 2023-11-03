import CoachAccount from "./CoachAccount"
import PlayerAccount from "./PlayerAccount"
import { Alert } from 'antd';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Account({handleLoginorSignUp, user, handleUpdateUser, mainContainer, popup, deleteError}) {

    const navigate = useNavigate()
    const [ successfulUpdate, setSuccessfulUpdate ] = useState(false)
    const [ passwordError, setPasswordError ] = useState(false)
    const [ serverError, setServerError ] = useState(false)

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
        <button onClick={handleLogoutClick}>Log Out</button>
        <button onClick={handleDeleteAccount}>Delete Account</button>

        {successfulUpdate? <Alert message="Account Successfully Updated!" type="success" banner closable showIcon /> : null}
        {passwordError? <Alert message="The current password you entered did not match what we have on file, please try again." type="error" banner closable showIcon /> : null}
        {serverError? <Alert message="There was an error updating your account, please try again later!" type="error" banner closable showIcon /> : null}
        {deleteError? <Alert message="There was an error deleting your account, please try again later!" type="error" banner closable showIcon /> : null}

        {user.is_admin? (
            <CoachAccount 
                user={user} 
                handleUpdateUser={handleUpdateUser}
                handleServerError={handleServerError}
                handlePasswordError={handlePasswordError}
                handleSucessfulUpdate={handleSucessfulUpdate}
            />
        ) : (
            <PlayerAccount 
                user={user} 
                handleUpdateUser={handleUpdateUser}
                handleServerError={handleServerError}
                handlePasswordError={handlePasswordError}
                handleSucessfulUpdate={handleSucessfulUpdate}
            />
        )
    }
    </div>
  )
}

export default Account