import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { io } from 'socket.io-client';
import { AuthContext } from '../context/LoginContext';

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

const ChatDialogueBox = ({isOpen, onClose}) => {
    const auth = useContext(AuthContext)
    const [Socket, setSocket] = useState(null);
    const [msg, setMsg] = useState('')
    const [chatMsg, setChatMsg] = useState([])
    const [connetionError, setConnetionError] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [userList, setUserList] = useState([])

    const uid = useMemo(()=>Math.floor(Math.random() * (999 - 100 + 1)) + 100,[])
    // const socket = useMemo(()=>io('http  ://localhost:9000'), [])
    console.log('users', userList)
    console.log('selectedUser', selectedUser)

    const getUserList = async () => {
        try {
            const users = await axios.get('http://localhost:9000/users');
            setUserList(users?.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
      getUserList()
    }, [])
    

    useEffect(() => {
      if(isOpen) {
        var socket = io('http://localhost:9000')
        setSocket(socket)

        // socket.on('get_users', data=>{
        //   console.log('users', data)   
        // })
        
        socket.on('message', data=>{
          console.log('data', data)
          setConnetionError('')
          setChatMsg(prev=>[...prev, data])
        })

        socket.on('connect_error', (error) => {
          setConnetionError(error.message);
        });
      }
    return () => {
      socket.off('message'); // Remove the 'message' listener
      socket.disconnect(); // Disconnect the socket
    };
      
    }, [isOpen])

    useEffect(() => {
      console.log('chatMsg', chatMsg)
    }, [chatMsg])
    

    const sendMessageToServer = () => {
        if(Socket && msg.trim() !== ''){
            Socket.emit('chat', {message: msg, uid})
            setMsg('')
        }
    } 

    return(
        <div class="chat-card slide-in-up card">
            <div class="card-body">
                <div className='card-header'>
                    <i class="bi bi-x-square-fill" onClick={onClose}></i>
                </div>
                {
                    selectedUser ?
                    <>
                        <div className='chat-area'>
                            {
                                chatMsg.map(item=>(
                                    item.uid === uid ? <UserChat message={item.message} /> : <ResponseChat message={item.message} />
                                ))
                            }
                            {
                                connetionError &&
                                <Alert variant='danger'>Connection Error</Alert>
                            }
                        </div>
                        <div className='card-input'>
                            <input type='text' style={{width: '100%'}} value={msg} onKeyDown={(e)=>(e.key === 'Enter' && sendMessageToServer())} onChange={e=>setMsg(e.target.value)} />
                            <Button onClick={sendMessageToServer}>Send</Button>
                        </div>
                    </>
                    :
                    <ListGroup defaultActiveKey="#link1">
                        {
                            userList.length !== 0 &&
                            // Making sure the loggedUser must not show in the other user list in chat
                            userList.filter(user=>user.id !== auth.userData.id).map(user=>(
                                <ListGroup.Item key={user?.id} action onClick={()=>setSelectedUser(user)}>
                                    <Row >
                                        <Col xs={2}>
                                            <img src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=" alt="Avatar" class="avatar" />
                                        </Col>
                                        <Col xs={10} className='my-auto'>
                                            {user?.firstname + ' ' + user?.lastname}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))
                        }
                    </ListGroup>
                }
            </div>
        </div>
    )
}

const ChatBtn = ({onOpen}) => (
    <button class="btn btn-primary floating-btn" onClick={onOpen}>
        <i class="btn-icon bi bi-chat"></i>
    </button>
)

const Chat = ({handleLoginModalOpen}) => {
  const auth = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  
  const handleChatOpen = () => {
    if(auth.loginStatus) return setIsOpen(true);
    handleLoginModalOpen();
  }

  return (
    <>
        {isOpen ? <ChatDialogueBox isOpen={isOpen} onClose={()=>setIsOpen(false)} /> : <ChatBtn onOpen={handleChatOpen} />}
    </>
  )
}

export default Chat