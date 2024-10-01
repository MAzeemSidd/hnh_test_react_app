import { useContext, useEffect, useState } from 'react';
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

  return (
    <div className='App container-fluid bg-light'>
      <AuthProvider>
        <Header handleShow={() => setShowSignupModal(true)} handleLoginModalOpen={()=>setShowLoginModal(true)} />
        <Body />
        <Chat handleLoginModalOpen={()=>setShowLoginModal(true)} />
        <LoginModal showLoginModal={showLoginModal} handleLoginModalClose={()=>setShowLoginModal(false)} />
        <SignupModal showSignupModal={showSignupModal} handleClose={() => setShowSignupModal(false)} />
      </AuthProvider>
    </div>
  );
}

export default App;
