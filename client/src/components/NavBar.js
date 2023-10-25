import { NavLink } from "react-router-dom";

function NavBar(){
    return (
        <div>
            <img src="https://www.lee-evans.co.uk/wp-content/uploads/2019/10/Headshot-Blank-300x300.jpg" alt="Headshot of Kimberly Love"/>
            <h3>Kimberly Love</h3>
            <nav>
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/teams">Teams</NavLink>
                <NavLink to="/players">Players</NavLink>
                <NavLink to="/schedule">Schedule</NavLink>
                <NavLink to="/account">Account</NavLink>
            </nav>
        </div>
    )
}

export default NavBar;