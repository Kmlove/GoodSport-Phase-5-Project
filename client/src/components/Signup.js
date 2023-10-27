import { useState } from "react"
import SignupCoach from "./SignupCoach"
import SignupPlayer from "./SignupPlayer"

function Signup({handleLoginorSignUp, handleSetUser}) {
  const [isPlayer, setIsPlayer] = useState(false)

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
        <SignupPlayer /> : 
        <SignupCoach 
          handleLoginorSignUp={handleLoginorSignUp} 
          handleSetUser={handleSetUser}
        />
      }
    </div>
  )
}

export default Signup