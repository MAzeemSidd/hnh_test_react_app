import axios from 'axios';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
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
    const [userId, setUserId] = useState(auth.userData.id)
    const [Socket, setSocket] = useState(null);
    const [msg, setMsg] = useState('')
    const [chatMsg, setChatMsg] = useState([])
    const [connetionError, setConnetionError] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [userList, setUserList] = useState([])
    const [chatList, setChatList] = useState([])
    const socketRef = useRef(null) //Using Ref instead of State
    const [chats, setChats] = useState({})

    // const uid = useMemo(()=>Math.floor(Math.random() * (999 - 100 + 1)) + 100,[])
    // const socket = useMemo(()=>io('http://localhost:9000'), [])

    const getUserList = async () => {
        try {
            const users = await axios.get('http://localhost:9000/users');
            const filteredUser = users?.data?.filter(user=>user.id !== auth.userData.id)
            setUserList(filteredUser)
        } catch (err) {
            console.log(err)
        }
    }

    const getChatList = async () => {
        try {
            const users = await axios.get('http://localhost:9000/chats/list');
            setChatList(users?.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
      getUserList()
    }, [])

    useEffect(() => {
      //Creating chat object
      if(userList.length > 0) {
        const initialChats = {}
        userList.forEach(item=>{
          initialChats[item.id] = [];
        })
        setChats(initialChats)
      }
    }, [userList])
    

    useEffect(() => {
      if(isOpen) {
        socketRef.current = io('http://localhost:9000')

        //Register the user on connection
        socketRef.current.on('connect', () => {
            console.log(`Connected with socket ID: ${socketRef.current.id}`);
            socketRef.current.emit('register', userId); //User Registeration
        });
    
        // Listen for incoming messages
        socketRef.current.on('message', (data) => {
            console.log(`Message from User ${data.from}: ${data.message}`);
            setConnetionError('')
            setChatMsg(prev=>[...prev, data])
        });
    
        // Listen for error messages
        socketRef.current.on('connect_error', (error) => {
            console.error('Connection Error:', error.message);
            setConnetionError(error.message)
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });
      }
      return () => {
        if (socketRef.current) {
            socketRef.current.off('connect');
            socketRef.current.off('message');
            socketRef.current.off('connect_error');
            socketRef.current.off('disconnect');
            socketRef.current.disconnect();
        }
      }
    }, [isOpen, userId])


    useEffect(() => {
        console.log('chatMsg', chatMsg)
    
        if (chatMsg.length > 0) {
            const lastMsg = chatMsg[chatMsg.length - 1];
            const { from, to } = lastMsg;
        
            setChats(prevChats => {
                // Create a shallow copy of the previous chats
                const newChats = { ...prevChats };
            
                // Determine the key to update (either 'from' or 'to')
                const key = newChats[from] ? from : to;
            
                if (key) {
                    // Create a new array for the specific chat to ensure immutability
                    newChats[key] = [...newChats[key], lastMsg];
                }
            
                return newChats;
            });
        }
    }, [chatMsg])

    //seeing selectedUser everytime when change
    useEffect(() => {
      console.log('selectedUser', selectedUser)
      if(selectedUser){
        try {
            const oneOnOneChat = axios.get('http://localhost:9000/chats');

        } catch {
          selectedUser(null)  
        }
      }
    }, [selectedUser])

    //seeing chats on state change
    useEffect(() => {
      console.log('chats', chats)
    }, [chats])
    

    const sendMessageToServer = () => {
        // if(Socket && msg.trim() !== ''){
        //     Socket.emit('chat', {message: msg, uid})
        //     setMsg('')
        // }
        if (socketRef.current && selectedUser.id && msg.trim() !== '') {
            socketRef.current.emit('chat', {
              from: userId,
              to: selectedUser.id,
              message: msg.trim(),
              chatId: (userId < selectedUser.id) ? `${userId}-${selectedUser.id}` : `${selectedUser.id}-${userId}`
            });
            
            setMsg('');
        }
    } 

    return(
        <div className='chat-card slide-in-up'>
            <Card style={{height: '100%', width: '100%'}}>
                <Card.Header className='py-1 px-1 d-flex flex-row-reverse justify-content-between'>
                    <Button size="sm" className='text-secondary' variant="outline-light" onClick={onClose}><i class="bi bi-x-lg"></i></Button>
                    {
                        selectedUser &&
                        <Button
                            size="sm"
                            className='w-25 text-secondary'
                            variant="outline-light"
                            onClick={()=>setSelectedUser(null)}
                        >
                            <i class="bi bi-arrow-left me-1"></i>
                            <text>Back</text>
                        </Button>
                    }
                </Card.Header>
                <Card.Body style={{overflowY: 'scroll', maxHeight: '400px'}}>
                    {
                        selectedUser ?
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', paddingBottom: 5}}>
                            {
                                userId && chats[selectedUser?.id]?.map(item=>(
                                    item.from === userId ? <UserChat message={item.message} /> : <ResponseChat message={item.message} />
                                ))
                            }
                            {
                                connetionError &&
                                <Alert variant='danger'>Connection Error</Alert>
                            }
                        </div>
                        :
                        <ListGroup defaultActiveKey="#link1">
                            {
                                userList.length !== 0 &&
                                // Making sure the loggedUser must not show in the other user list in chat
                                userList.map(user=>(
                                    <ListGroup.Item key={user?.id} action onClick={()=>setSelectedUser(user)}>
                                        <div className='d-flex align-items-center'>
                                            <img
                                                src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                                                alt="Avatar"
                                                class="avatar ms-2 me-3"
                                            />
                                            <text >{user?.firstname + ' ' + user?.lastname}</text>
                                        </div>
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    }
                </Card.Body>
                <Card.Footer className='d-flex px-1 py-1'>
                    <input
                        type='text'
                        className='form-control form-control-sm me-1'
                        value={msg}
                        onKeyDown={(e)=>(e.key === 'Enter' && sendMessageToServer())}
                        onChange={e=>setMsg(e.target.value)}
                    />
                    <Button size='sm'><i class="bi bi-arrow-up-right" onClick={sendMessageToServer}></i></Button>
                </Card.Footer>
            </Card>
        </div>
        // <div class="chat-card slide-in-up card">
        //     <div class="card-body">
        //         <div className='card-header'>
        //             <i class="bi bi-x-square-fill" onClick={onClose}></i>
        //         </div>
        //         {
        //             selectedUser ?
        //             <>
        //                 <div className='chat-area'>
        //                     {
        //                         userId && selectedUser?.id && chats[selectedUser?.id]?.map(item=>(
        //                             item.from === userId ? <UserChat message={item.message} /> : <ResponseChat message={item.message} />
        //                         ))
        //                     }
        //                     {
        //                         connetionError &&
        //                         <Alert variant='danger'>Connection Error</Alert>
        //                     }
        //                 </div>
        //                 <div className='card-input'>
        //                     <input type='text' style={{width: '100%'}} value={msg} onKeyDown={(e)=>(e.key === 'Enter' && sendMessageToServer())} onChange={e=>setMsg(e.target.value)} />
        //                     <Button onClick={sendMessageToServer}>Send</Button>
        //                 </div>
        //             </>
        //             :
        //             <ListGroup defaultActiveKey="#link1">
        //                 {
        //                     userList.length !== 0 &&
        //                     // Making sure the loggedUser must not show in the other user list in chat
        //                     userList.map(user=>(
        //                         <ListGroup.Item key={user?.id} action onClick={()=>setSelectedUser(user)}>
        //                             <Row >
        //                                 <Col xs={2}>
        //                                     <img src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=" alt="Avatar" class="avatar" />
        //                                 </Col>
        //                                 <Col xs={10} className='my-auto'>
        //                                     {user?.firstname + ' ' + user?.lastname}
        //                                 </Col>
        //                             </Row>
        //                         </ListGroup.Item>
        //                     ))
        //                 }
        //             </ListGroup>
        //         }
        //     </div>
        // </div>
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