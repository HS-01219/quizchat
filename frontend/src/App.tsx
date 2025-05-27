import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import io, { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

function App() {
  const [count, setCount] = useState(0);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('서버에 연결됨!');
    });

    newSocket.on('disconnect', () => {
      console.log('서버 연결 끊김');
    });

    // 서버에서 'receiveMessage' 이벤트 받을 때
    newSocket.on('receiveMessage', (msg) => {
      console.log('서버로부터 메시지 수신:', msg);
      setMessages(prevMessages => [...prevMessages, msg]); 
    });

    return () => {
      newSocket.disconnect();
    };
  }, []); 

  const sendMessage = () => {
    if (socket && message) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <>
      <div>
        <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>메세지보내기</button>
      </div>
    </>
  )
}

export default App
