import React from 'react'
import "../CSS/messagingStyles.css"

function Messaging() {
  return (
    <div className='right'>
        <h2 className="containerHeaders">Messaging</h2>
        <div id="message-container">
            <div>
                Conversations
            </div>
            <div>
                Display Conversations
            </div>
        </div>
    </div>
  )
}

export default Messaging