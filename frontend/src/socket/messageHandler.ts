import { useEffect, useState } from 'react';
import { socket } from './socketManager';

export const useMessageHandler = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        // 메시지 수신
        socket.on('receiveMessage', (msg: string) => {
            console.log('서버로부터 메시지 수신:', msg);
            setMessages(prevMessages => [...prevMessages, msg]); 
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const sendMessage = () => {
        if (socket && message.trim() !== '') {
            socket.emit('sendMessage', message);
            setMessage('');
        }
    };

    return { message, setMessage, messages, sendMessage};
}