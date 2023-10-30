import { useState, useEffect } from "react"
import SignupCoach from "./SignupCoach"
import SignupPlayer from "./SignupPlayer"

function Signup({handleLoginorSignUp, handleSetUser}) {
  const [isPlayer, setIsPlayer] = useState(false)
  const [clubs, setClubs] = useState([])

  useEffect(() => {
    fetch('/clubs')
    .then(res => res.json())
    .then(clubs => setClubs(clubs))
  }, [])

  return (
    <div>
      <label htmlFor="isPlayer">{isPlayer? "Are you a Coach?" : "Are you a Player?"}</label>
      <input 
        type="checkbox" 
        checked={isPlayer} 
        onChange={(e) => setIsPlayer(e.target.checked)} 
        id="isPlayer"
      />

      {isPlayer ? 
        <SignupPlayer
          handleLoginorSignUp={handleLoginorSignUp} 
          handleSetUser={handleSetUser} 
          clubs={clubs}
        /> 
        : 
        <SignupCoach 
          handleLoginorSignUp={handleLoginorSignUp} 
          handleSetUser={handleSetUser}
          clubs={clubs}
        />
      }
    </div>
  )
}

export default Signup