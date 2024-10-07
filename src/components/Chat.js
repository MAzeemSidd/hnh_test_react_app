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
    const [msg, setMsg] = useState('')
    const [chatMsg, setChatMsg] = useState([])
    const [connetionError, setConnetionError] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [userList, setUserList] = useState([])
    const socketRef = useRef(null) //Using Ref instead of State
    const [chats, setChats] = useState({})
    const [selectedChatId, setSelectedChatId] = useState('')
    const lastMsgRef = useRef(null)

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
            const chatsList = await axios.get('http://localhost:9000/chats/list');
            console.log('chatsList', chatsList?.data)

            const initialChats = {} //Temp object to add fields in it
            chatsList?.data?.forEach(item=>{
                initialChats[item.chatId] = [];
            })
            setChats(initialChats) //Now set the chats state to initialChats object
        } catch (err) {
            console.log(err)
        }
    }

    const getAParticularChat = async (chatId) => {
        try {
            console.log('chatId', chatId)
            // const messageId = chats[chatId][chats[chatId].length - 1]?.id
            // const query = lastMsgId ?
            //     `http://localhost:9000/chats?chatId=${chatId}&mesageId=${lastMsgId}`
            //     :
            //     `http://localhost:9000/chats?chatId=${chatId}`
            const query = `http://localhost:9000/chats?chatId=${chatId}`
            const oneOnOneChat = await axios.get(query);
            console.log('oneOnOneChat', oneOnOneChat?.data)
            
            setChats(prevChats => {
                // Create a shallow copy of the previous chats
                const newChats = { ...prevChats };
                // Add 
                newChats[chatId] = [...newChats[chatId], ...oneOnOneChat?.data];
                return newChats;
            });
            
        } catch {
          selectedUser(null)  
        }
    }

    const sendMessageToServer = () => {
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

    useEffect(() => {
        getUserList(); //Fetching Users
        getChatList(); //Fetching Chats in db
    }, []) 

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
      if (chatMsg.length > 0) {
        const lastMsg = chatMsg[chatMsg.length - 1];
        const { chatId } = lastMsg;

        setChats(prevChats => {
          const newChats = { ...prevChats };
          newChats[chatId] = [...newChats[chatId], lastMsg];
          return newChats;
        });
      }
    }, [chatMsg]);

    useEffect(() => {
      console.log('selectedUser', selectedUser)
      if (selectedUser) {
        const _selectedChatId = (userId < selectedUser?.id) ? `${userId}-${selectedUser?.id}` : `${selectedUser?.id}-${userId}`;
        // Clear the previous chat if a new user is selected
        setChats((prevChats) => {
        const newChats = { ...prevChats };
          newChats[_selectedChatId] = []; // Clear the chat for this user before fetching new messages
          return newChats;
        });
        setSelectedChatId(_selectedChatId);
      }
    }, [selectedUser]);

    useEffect(() => {
      if (selectedChatId) {
        if (!chats[selectedChatId] || chats[selectedChatId].length === 0) {
            getAParticularChat(selectedChatId);
        }
      }
    }, [selectedChatId]);

    //seeing chats on state change
    useEffect(() => {
      console.log('chats', chats)
    //   if(lastMsgId && chats[selectedChatId][chats[selectedChatId]?.length - 1]?.id != lastMsgId) {
    //     setLastMsgId(chats[selectedChatId][chats[selectedChatId].length - 1]?.id)
    //   }
      /* Scroll to the end of the chat to see latest messages.
      We can pass { behavior: 'smooth' } into scrollIntoView function for smooth scroll. */
      if(selectedChatId && chats[selectedChatId].length !== 0) lastMsgRef.current?.scrollIntoView();
    }, [chats])

    return(
        <div className='chat-card slide-in-up'>
            <Card style={{height: '100%', width: '100%'}}>
                <Card.Header className='py-1 px-1 d-flex flex-row-reverse justify-content-between bg-primary'>
                    <button className='btn btn-sm btn-primary text-light border-0' onClick={onClose}><i class="bi bi-x-lg"></i></button>
                    {
                        selectedUser &&
                        <button
                            className='btn btn-sm btn-primary text-light border-0'
                            onClick={()=>{
                                setSelectedChatId('')
                                setSelectedUser(null)
                            }}
                        >
                            <i class="bi bi-arrow-left me-1"></i>
                            {/* <text>Back</text> */}
                        </button>
                    }
                </Card.Header>
                <Card.Body className='card-body' style={{overflowY: 'scroll', maxHeight: '400px'}}>
                    {
                        selectedChatId && chats ?
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '100%', paddingBottom: 5, overflowY: 'auto'}}>
                            {
                                chats[selectedChatId]?.map((item, index)=>(
                                    item.from === userId ? 
                                    (<UserChat message={item.message} />)
                                    :
                                    (<ResponseChat message={item.message} />)
                                ))
                            }
                            {
                                connetionError &&
                                <Alert variant='danger'>Connection Error</Alert>
                            }
                            <div ref={lastMsgRef} />
                        </div>
                        :
                        <ListGroup defaultActiveKey="#link1" style={{overflowY: 'auto', minHeight: '100%'}}>
                            {
                                userList.length !== 0 &&
                                userList.map(user=>(
                                    <ListGroup.Item key={user?.id} action onClick={() => setSelectedUser(user)}>
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