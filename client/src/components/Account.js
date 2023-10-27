import { useNavigate } from "react-router-dom";


function Account({handleLoginorSignUp}) {
  const navigate = useNavigate()

  function handleClick(e){
    fetch('/logout', {
      method: "DELETE",
    })
    .then(() => {
      handleLoginorSignUp(false)
      navigate('/')
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Log Out</button>
    </div>
  )
}

export default Account;
