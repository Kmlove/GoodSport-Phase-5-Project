import React, { useState } from 'react'
import sportsBalls from "../IMAGES/photo-sports-balls.jpg"
import { DownOutlined } from '@ant-design/icons';
import "../CSS/headerStyles.css"
import NavBarSmallScreen from "./NavBarSmallScreen";

function Header({viewportWidth, handleSetFilterScheduleEventsValue, handleFutureEventsCheck}){
    const [ displayNav, setDisplayNav ] = useState(false)

    function handleCloseNavBar(){
        setDisplayNav(false)
    }

    return(
        <header className="header">
            <div id='header-content-container'>
                <img className="logo" src={sportsBalls} alt="Sports Balls Array" />
                <h1 className="app-title"><span className="good">Good</span><span className="sport">Sport</span></h1>
                <img className="logo" src={sportsBalls} alt="Sports Balls Array" />
            </div>
            {viewportWidth > 430 ? null : <button id='navBarButton' onClick={e => setDisplayNav(!displayNav)}><DownOutlined /></button>}
            {displayNav? 
                <NavBarSmallScreen 
                    handleSetFilterScheduleEventsValue={handleSetFilterScheduleEventsValue} handleFutureEventsCheck={handleFutureEventsCheck}
                    handleCloseNavBar={handleCloseNavBar}
                /> 
            : null}
        </header>
    )
}

export default Header;