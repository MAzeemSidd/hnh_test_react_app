import './App.css'
import Body from './components/Body';
import Chat from './components/Chat';
import Home from './components/Home';

function App() {
  return (
    <div className='App container-fluid bg-light'>
      <Home />
      <Body />
      <Chat />
    </div>
  );
}

export default App;
