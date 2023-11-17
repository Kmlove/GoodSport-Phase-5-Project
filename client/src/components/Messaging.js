// In your JavaScript file
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab, Nav, Tabs } from 'react-bootstrap'
import React, { useState } from 'react'
import "../CSS/messagingStyles.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import CoachContacts from './CoachContacts';
import PlayerContacts from './PlayerContacts'

const CONVERSATIONS_KEY = "conversations"
const CONTACTS_KEY = "contacts"

function Messaging({user, teams}) {
  const [toggleState, setToggleState] = useState(1);
  const [ activePlayer, setActivePlayer ] = useState("")

  function handleSetActivePlayer(value){
    setActivePlayer(value)
  }

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
                  onClick={() => {
                    setToggleState(2)
                    setActivePlayer("")
                    document.querySelector('#contacts').scrollTop = 0
                  }}
                >Conversations</div>
                <span className='icon-color' id="font-awesome"><FontAwesomeIcon icon={faPenToSquare} size='lg'/></span>
              </div>

              <div className='content-container'>
                <div id="contacts" className={toggleState === 1? 'content active-content' : 'content'}>
                  {user.is_admin? 
                    <CoachContacts 
                      user={user} 
                      teams={teams}
                      handleSetActivePlayer={handleSetActivePlayer}
                      activePlayer={activePlayer}
                    /> 
                    : 
                    <PlayerContacts />}
                </div>

                <div className={toggleState === 2? 'content active-content' : 'content'}>
                  <p>Conversations</p>
                </div>
              </div>

            </div>

            <div id="conversations-display-container">
              <div className='messages-subheaders' style={{height: "61px"}}>
                <h3>Conversations Display</h3>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Messaging