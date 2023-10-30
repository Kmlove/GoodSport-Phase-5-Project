import { useState, useEffect } from "react"
import SignupCoach from "./SignupCoach"
import SignupPlayer from "./SignupPlayer"
import { Switch } from 'antd';

function Signup({handleLoginorSignUp, handleSetUser}) {
  const [isPlayer, setIsPlayer] = useState(false)
  const [clubs, setClubs] = useState([])
  const [showServerErrorAlert, setShowServerErrorAlert] = useState(false)

  useEffect(() => {
    fetch('/clubs')
    .then(res => res.json())
    .then(clubs => setClubs(clubs))
  }, [])

  useEffect(() => {
    if (showServerErrorAlert) {
      // Use a setTimeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        setShowServerErrorAlert(false);
      }, 3000); // 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    } 
  }, [ showServerErrorAlert ]);

  function handleShowServerErrorAlert(value){
    setShowServerErrorAlert(value)
  }

  return (
    <div>
      <label htmlFor="isPlayer">{isPlayer? "Are you a Coach?" : "Are you a Player?"}</label>
      {/* <input 
        type="checkbox" 
        checked={isPlayer} 
        onChange={(e) => setIsPlayer(e.target.checked)} 
        id="isPlayer"
      /> */}
      <Switch value={isPlayer} checkedChildren="Create Player" unCheckedChildren="Create Coach" defaultChecked onChange={() => setIsPlayer(!isPlayer)}/>

      {isPlayer ? 
        <SignupPlayer
          handleLoginorSignUp={handleLoginorSignUp} 
          handleSetUser={handleSetUser} 
          clubs={clubs}
          showServerErrorAlert={showServerErrorAlert}
          handleShowServerErrorAlert={handleShowServerErrorAlert}
        /> 
        : 
        <SignupCoach 
          handleLoginorSignUp={handleLoginorSignUp} 
          handleSetUser={handleSetUser}
          clubs={clubs}
          showServerErrorAlert={showServerErrorAlert}
          handleShowServerErrorAlert={handleShowServerErrorAlert}
        />
      }
    </div>
  )
}

export default Signup