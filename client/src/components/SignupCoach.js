import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function SignupCoach({handleSetUser, handleLoginorSignUp, clubs}) {

  const initialValue = {
    club_id: "",
    coach_name: "",
    email: "",
    password: ""
  }

  const navigate = useNavigate()
  const [signupForm, setSignupForm] = useState(initialValue)

  function handleChange(e){
    const {name, value} = e.target

    setSignupForm({
      ...signupForm,
      [name]: value
    })
  }

  function handleSubmit(e){
    e.preventDefault()

    const club_id_num = Number(signupForm['club_id'])
    const formdata = {
      ...signupForm,
      club_id: club_id_num
    }

    fetch('/coaches', {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(formdata)
    })
    .then(res => res.json())
    .then(data => {
      handleSetUser(data)
      handleLoginorSignUp(true)
      navigate('/home')
    })
  }
  
  return (
    <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="coach_name">Name:</label>
            <input type="text" name="coach_name" id="coach_name" value={signupForm.coach_name} onChange={handleChange}/>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" value={signupForm.email} onChange={handleChange}/>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" value={signupForm.password} onChange={handleChange}/>
            <label htmlFor="club_id">Select your club:</label>
            <select name="club_id" id="club_id" onChange={handleChange}>
                <option value=""></option>
                {clubs.map(club => <option key={club.id} value={club.id}>{club.club_name}</option>)}
            </select>
            <input type="submit" value="Sign Up" />
        </form>
        <button onClick={() => navigate('/')}>Login</button>
    </>
  )
}

export default SignupCoach;