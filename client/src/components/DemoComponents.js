import React from "react"
import '../CSS/toastDemoStyles.css'

function DemoCoachLoginComponent(){
    return (
      <div id="custom-toast">
        <p>Demo Coach Account Login Info:</p>
        <p><span>Username:</span> kim1@email.com</p>
        <p><span>Password:</span> Password1</p>
        <p>*username and password case sensitive</p>
      </div>
    )
}
  
function DemoPlayerLoginComponent(){
    return (
        <div id="custom-toast">
        <p>Demo Player Account Login Info:</p>
        <p><span>Username:</span> holly1@email.com</p>
        <p><span>Password:</span> Password1</p>
        <p>*username and password case sensitive</p>
        </div>
    )
}

export { DemoCoachLoginComponent, DemoPlayerLoginComponent }