import React, { useState } from 'react'
import "../CSS/messagingStyles.css"
// In your JavaScript file
// import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Tab, Nav, Tabs } from 'react-bootstrap'

const CONVERSATIONS_KEY = "conversations"
const CONTACTS_KEY = "contacts"

function Messaging() {
  const [toggleState, setToggleState] = useState(1);

  return (
    <div className='right'>
        <h2 className="containerHeaders">Messaging</h2>
        <div id="message-container">
          
            <div id="conversations-container" className='d-flex flex-column'>

              <div className='block-tabs'>
                <div 
                  className={toggleState === 1? 'tabs active-tabs contacts' : 'tabs'}
                  style={{borderRadius:"10px 0 0 0", borderRight: "1px solid #ccc"}}
                  onClick={() => setToggleState(1)}
                >Contacts</div>
                <div 
                  className={toggleState === 2? 'tabs active-tabs' : 'tabs'}
                  style={{borderRight:"1px solid #ccc"}}
                  onClick={() => setToggleState(2)}
                >Conversations</div>
                <span className='icon-color' id="font-awesome"><FontAwesomeIcon icon={faPenToSquare} size='lg'/></span>
              </div>

              <div className='content-container'>
                <div className={toggleState === 1? 'content active-content' : 'content'}>
                  <p>Contacts</p>
                </div>

                <div className={toggleState === 2? 'content active-content' : 'content'}>
                  <p>Conversations</p>
                </div>
              </div>

            </div>

            <div id="conversations-display-container">
              <div className='messages-subheaders'>
                <h3>Conversations Display</h3>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Messaging