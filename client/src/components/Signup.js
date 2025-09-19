import { useState, useEffect } from "react";
import SignupCoach from "./SignupCoach";
import SignupPlayer from "./SignupPlayer";
import { Switch } from "antd";
import "../CSS/signupStyles.css";

function Signup({
  handleLoginorSignUp,
  handleSetUser,
  showServerErrorAlert,
  handleShowServerErrorAlert,
  toast,
}) {
  const [isPlayer, setIsPlayer] = useState(true);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetch("/clubs")
      .then((res) => res.json())
      .then((clubs) => setClubs(clubs))
      .catch((error) => {
        console.error(`There was as error fetching clubs: ${error}`);
      });
  }, []);

  function handleDisplayToast() {
    const toast = document.querySelector(".Toastify__toast-container");
    if (toast) {
      toast.style.display = "flex";
      toast.style.flexDirection = "column";
    }
  }

  function handleHideToast() {
    const toast = document.querySelector(".Toastify__toast-container");
    if (toast) {
      toast.style.display = "none";
    }
  }

  return (
    <div id="signups">
      <div id="isPlayer">
        <label htmlFor="isPlayer">
          {isPlayer ? "Are you a Player?" : "Are you a Coach?"}
        </label>

        <Switch
          id="switch"
          checked={isPlayer}
          checkedChildren="Create Player"
          unCheckedChildren="Create Coach"
          defaultChecked
          onChange={() => {
            setIsPlayer(!isPlayer);
            handleShowServerErrorAlert(false);
          }}
        />
      </div>

      {isPlayer ? (
        <SignupCoach
          handleLoginorSignUp={handleLoginorSignUp}
          handleSetUser={handleSetUser}
          clubs={clubs}
          showServerErrorAlert={showServerErrorAlert}
          handleShowServerErrorAlert={handleShowServerErrorAlert}
          handleDisplayToast={handleDisplayToast}
          handleHideToast={handleHideToast}
        />
      ) : (
        <SignupPlayer
          handleLoginorSignUp={handleLoginorSignUp}
          handleSetUser={handleSetUser}
          clubs={clubs}
          showServerErrorAlert={showServerErrorAlert}
          handleShowServerErrorAlert={handleShowServerErrorAlert}
          handleDisplayToast={handleDisplayToast}
          handleHideToast={handleHideToast}
        />
      )}
    </div>
  );
}

export default Signup;
