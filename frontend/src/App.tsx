import './App.css'
import { useState } from 'react'
import { useMessageHandler } from './socket/messageHandler';
import { useVoteHandler } from './socket/voteHandler';

function App() {
  // 메시지 관련
  const { message, setMessage, messages, sendMessage } = useMessageHandler();

  // 투표 관련
  const { vote, startVote, submitVote, endVote } = useVoteHandler();
  const [newTitle, setNewTitle] = useState('');
  const [newItems, setNewItems] = useState<string[]>(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleVoteClick = (itemId: string) => {
    if(!vote || !vote.isActive) return;

    const update = new Set(selectedItems);

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

    if(update.has(itemId)){
      update.delete(itemId);
    }else{
      if(!vote?.isMultiple){
        update.clear();
      }
      update.add(itemId);
    }

    setSelectedItems(update);
    submitVote(Array.from(update));
  }

  return (
    <>
      {/* 메시지 */}
      <div>
        <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>메세지 보내기</button>
      </div>
      {/* 투표 */}
      <div>
        <h3>투표 생성하기</h3>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='투표 제목'/>
        {newItems.map((item, index) => (
            <input key={index} value={item}
              onChange={(e) => {
                const newArray = [...newItems];
                newArray[index] = e.target.value;
                setNewItems(newArray);
              }}
              placeholder={`항목 ${index + 1}`}/>
        ))}
        <button onClick={() => setNewItems([...newItems, ''])}>항목 추가</button>
        <label>
          <input type='checkbox' checked={allowMultiple} onChange={(e) => setAllowMultiple(e.target.checked)}/>
          중복 투표 가능
        </label>
        <button onClick={() => startVote(newTitle, newItems, allowMultiple)}>투표 시작</button>

        {/* 현재 투표 상태 */}
        {vote && (
          <div>
            <h3>{vote.title}</h3>
            {vote.items.map((item) => (
              <div key={item.itemId}>
                <button onClick={() => handleVoteClick(item.itemId)}
                  // style={{ backgroundColor: selectedItems.has(item.itemId) ? 'gray' : 'transparent'}}
                >
                  {item.text} ({item.count})
                </button>
              </div>
            ))}
            {vote.isActive && <button onClick={endVote}>투표 종료</button>}
          </div>
        )}
      </div>
    </>
  )
}

export default App
