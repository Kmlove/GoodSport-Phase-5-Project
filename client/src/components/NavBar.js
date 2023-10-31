import { NavLink } from "react-router-dom";
import "../CSS/navBarStyles.css"
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function NavBar({user}){
    const {player_name, coach_name} = user
    return (
        <div className="navBarContainer">
            {/* <img src="https://www.lee-evans.co.uk/wp-content/uploads/2019/10/Headshot-Blank-300x300.jpg" alt="Headshot of Kimberly Love"/> */}
            <Avatar size={125} icon={<UserOutlined />} />
            <h3>{coach_name ? coach_name : player_name}</h3>
            <nav className="navBar">
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