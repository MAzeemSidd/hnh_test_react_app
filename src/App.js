import { useEffect, useState } from 'react';
import './App.css'
import Body from './components/Body';
import Chat from './components/Chat';
import Header from './components/Header';
import SignupModal from './components/SignupModal';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './context/LoginContext';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    localStorage.setItem('loginStatus', JSON.stringify(false))
  },[])

  // Check localStorage on component mount
  useEffect(() => {
    const loginStatus = localStorage.getItem('loginStatus');

    setIsLoggedIn(loginStatus);
  }, [showLoginModal, showSignupModal]);

  const handleClose = () => setShowSignupModal(false);
  const handleShow = () => setShowSignupModal(true);

  return (
    <div className='App container-fluid bg-light'>
      <AuthProvider>
        <Header handleShow={handleShow} handleLoginModalOpen={()=>setShowLoginModal(true)} />
        <Body />
        <Chat isLoggedIn={isLoggedIn} handleLoginModalOpen={()=>setShowLoginModal(true)} />
        <LoginModal showLoginModal={showLoginModal} handleLoginModalClose={()=>setShowLoginModal(false)} />
        <SignupModal showSignupModal={showSignupModal} handleClose={handleClose} />
      </AuthProvider>
    </div>
  );
}

export default App;
