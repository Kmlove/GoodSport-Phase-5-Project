import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login({handleLoginorSignUp, handleSetUser}) {
  const navigate = useNavigate()

  const initialValue = {
    email: "",
    password: ""
  }
  const [loginForm, setLoginForm] = useState(initialValue)

  function handleChange(e){
    const {name, value} = e.target
    setLoginForm({
      ...loginForm,
      [name]: value
    })
  }

  function handleLoginSubmit(e){
    e.preventDefault()

    fetch('/login', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(loginForm)
    })
    .then(res => res.json())
    .then(data => {
      handleSetUser(data)
      handleLoginorSignUp()
      navigate('/home')
    })
  }

  return (
    <form onSubmit={handleLoginSubmit}>
      <label htmlFor="email" >Email</label>
      <input name="email" id="email" type="email" value={loginForm.email} onChange={handleChange}/>
      <label htmlFor="password">Password</label>
      <input name="password" id="password" type="password" value={loginForm.password} onChange={handleChange}/>
      <input type="submit" value="Log In"/>
    </form>
  )
}

export default Login