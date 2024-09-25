import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const ResponseChat = () => (
    <div className='response-chat-div'>
        <div className='response-chat'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia</div>
    </div>
)

const UserChat = () => (
    <div className='user-chat-div'>
        <div className='user-chat'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia</div>
    </div>
)

const ChatDialogueBox = ({onClose}) => (
    <div class="chat-card slide-in-up card">
        <div class="card-body">
            <div className='card-header'>
                <i class="bi bi-x-square-fill" onClick={onClose}></i>
            </div>
            <div className='chat-area'>
                <ResponseChat />
                <UserChat />
            </div>
            <div className='card-input'>
                <input type='text' style={{width: '100%'}} />
                <Button>Send</Button>
            </div>
        </div>
    </div>
)

const ChatBtn = ({onOpen}) => (
    <button class="btn btn-primary floating-btn" onClick={onOpen}>
        <i class="btn-icon bi bi-chat"></i>
    </button>
)

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
        {isOpen ? <ChatDialogueBox onClose={()=>setIsOpen(false)} /> : <ChatBtn onOpen={()=>setIsOpen(true)} />}
    </>
  )
}

export default Chat