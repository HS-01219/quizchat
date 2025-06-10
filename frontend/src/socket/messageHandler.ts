import { useEffect, useState } from 'react';
import { socket } from './socketManager';
import type { MessagePayload, SystemMessageProps } from '../common/types';

export const useMessageHandler = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<MessagePayload[]>([]);

    const [userId, setUserId] = useState<number>(1); // 임시 사용자 ID
    const [nickName, setNickName] = useState<string>('tester'); // 임시 사용자 닉네임

    useEffect(() => {
        // 메시지 수신
        socket.on('RECEIVE_MESSAGE', (msg: MessagePayload) => {
            console.log('서버로부터 메시지 수신:', msg);
            setMessages(prevMessages => [...prevMessages, msg]); 
        });

        socket.on('RECEIVE_SYSTEM_MSG', (msg: SystemMessageProps) => {
            console.log('서버로부터 시스템 메시지 수신:', msg);
            // 프론트 TODO : 모든 사용자에게 시스템 메세지 표시
            // 기존에 setSystemMessages를 여기서 실행해야 투표/퀴즈 시작 당사자에게 중복으로 출력되지 않음
        });

        return () => {
            socket.off('RECEIVE_MESSAGE');
            socket.off('RECEIVE_SYSTEM_MSG');
        };
    }, []);

    const sendMessage = () => {
        if (socket && message.trim() !== '') {
            const sendMessage: MessagePayload = {
                userId: userId,
                nickName: nickName,
                content: message,
                timestamp: new Date().toISOString()
            };

            setMessages(prevMessages => [...prevMessages, sendMessage]);

            socket.emit('SEND_MESSAGE', message);
            setMessage('');

            setMessage(''); // 메시지 전송 후 입력 필드 초기화
        }
    };

    return { message, setMessage, messages, sendMessage};
}