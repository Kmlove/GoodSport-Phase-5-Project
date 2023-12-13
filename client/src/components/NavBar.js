import React from 'react'
import NavBarLeft from './NavBarLeft'

function NavBar({user, handleSetFilterScheduleEventsValue, handleFutureEventsCheck, viewportWidth}) {
        
    return (
        <>
            {viewportWidth > 430 ? 
                <NavBarLeft 
                    user={user} 
                    handleFutureEventsCheck={handleFutureEventsCheck} 
                    handleSetFilterScheduleEventsValue={handleSetFilterScheduleEventsValue}
                /> 
            : null
            }  
        </>
    )
}

export default NavBar