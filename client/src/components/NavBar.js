import { NavLink } from "react-router-dom";
import "../CSS/navBarStyles.css"
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function NavBar({user}){
    const {player_name, coach_name, headshot_img_url} = user
    return (
        <div className="navBarContainer">
            {headshot_img_url? 
                <div id="headshot-container">
                    <img 
                        src={headshot_img_url}
                        alt={`${coach_name} headshot`}
                    />
                </div> 
                : 
                <Avatar size={125} icon={<UserOutlined />} />
            }
            
            <h3>{coach_name ? coach_name : player_name}</h3>
            <nav className="navBar">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/teams">Teams</NavLink>
                <NavLink to="/schedule">Schedule</NavLink>
                <NavLink to="/account">Account</NavLink>
            </nav>
        </div>
    )
}

export default NavBar;