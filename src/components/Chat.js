import React, { useEffect, useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client';

const ResponseChat = ({message}) => (
    <div className='response-chat-div'>
        <div className='response-chat'>{message}</div>
    </div>
)

const UserChat = ({message}) => (
    <div className='user-chat-div'>
        <div className='user-chat'>{message}</div>
    </div>
)

const ChatDialogueBox = ({onClose}) => {
    const [Socket, setSocket] = useState(null);
    const [msg, setMsg] = useState('')
    const [chatMsg, setChatMsg] = useState([])

    const pid = useMemo(()=>Math.floor(Math.random() * (999 - 100 + 1)) + 100,[])
    const socket = useMemo(()=>io('http://localhost:9000'), [])

    useEffect(() => {
      setSocket(socket)
      
      socket.on('message', data=>{
        console.log('response', data)
        setChatMsg(prev=>[...prev, data])
      })

    return () => {
      socket.off('message'); // Remove the 'message' listener
    };
      
    }, [])

    useEffect(() => {
      console.log('chatMsg', chatMsg)
    }, [chatMsg])
    

    const sendMessageToServer = () => {
        if(Socket && msg.trim() !== ''){
            Socket.emit('chat', {message: msg, pid})
            setMsg('')
        }
    } 

    return(
        <div class="chat-card slide-in-up card">
            <div class="card-body">
                <div className='card-header'>
                    <i class="bi bi-x-square-fill" onClick={onClose}></i>
                </div>
                <div className='chat-area'>
                    {
                        chatMsg.map(item=>(
                            item.pid === pid ? <UserChat message={item.message} /> : <ResponseChat message={item.message} />
                        ))
                    }
                </div>
                <div className='card-input'>
                    <input type='text' style={{width: '100%'}} value={msg} onKeyDown={(e)=>(e.key === 'Enter' && sendMessageToServer())} onChange={e=>setMsg(e.target.value)} />
                    <Button onClick={sendMessageToServer}>Send</Button>
                </div>
            </div>
        </div>
    )
}

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