// In your JavaScript file
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab, Nav, Tabs } from 'react-bootstrap'
import React, { useState } from 'react'
import "../CSS/messagingStyles.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import CoachContacts from './CoachContacts';
import PlayerContacts from './PlayerContacts'
import { Input, Form, Button } from 'antd'

function Messaging({user, teams}) {
  const { TextArea } = Input
  const [ toggleState, setToggleState ] = useState(1);
  const [ activePlayer, setActivePlayer ] = useState("")
  const [ message, setMessage ] = useState("")

  function handleSetActivePlayer(value){
    setActivePlayer(value)
  }

  function handleMessageSend(){
    console.log(message)
    console.log(activePlayer)

    //sendMessage(activePlayer, message)

    setMessage("")
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
                <span 
                  className='icon-color' 
                  id="font-awesome"
                  onClick={""}
                ><FontAwesomeIcon icon={faPenToSquare} size='lg'/></span>
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
              <div id="convsersation-form-container-div">
                <div id="conversation">
                  <p>Convo....</p>
                </div>
                <Form id='conversation-form' onFinish={handleMessageSend}>
                  <Form.Item>
                    <TextArea 
                      rows={6} 
                      placeholder='Write a message...'
                      style={{resize: 'none'}} 
                      className='message-form-textarea'
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    <Button type="primary" htmlType="submit" className='button' style={{width: "150px"}}>
                      Send
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Messaging