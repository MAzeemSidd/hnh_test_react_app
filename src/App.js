import { useEffect, useState } from 'react';
import './App.css'
import Body from './components/Body';
import Chat from './components/Chat';
import Header from './components/Header';
import SignupModal from './components/SignupModal';
import LoginModal from './components/LoginModal';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    localStorage.setItem('loginStatus', JSON.stringify(false))
  },[])

  // Check localStorage on component mount
  useEffect(() => {
    const storedValue = JSON.parse(localStorage.getItem('loginStatus'));
    console.log('storedValue',typeof storedValue)
    if (storedValue) {
      const loginStatus = JSON.parse(storedValue)
      console.log('loginStatus', loginStatus)
      setIsLoggedIn(loginStatus);
    }
  }, [showLoginModal, showSignupModal]);

  const handleClose = () => setShowSignupModal(false);
  const handleShow = () => setShowSignupModal(true);

  return (
    <div className='App container-fluid bg-light'>
      <Header handleShow={handleShow} handleLoginModalOpen={()=>setShowLoginModal(true)} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Body />
      <Chat />
      <LoginModal showLoginModal={showLoginModal} handleLoginModalClose={()=>setShowLoginModal(false)} />
      <SignupModal showSignupModal={showSignupModal} handleClose={handleClose} />
    </div>
  );
}

export default App;
