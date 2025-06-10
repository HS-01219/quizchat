import { useEffect, useState } from 'react';
import { socket } from './socketManager';
import type { MessagePayload } from '../common/types';
import { useUserStore } from "@/store/useUserStore";

export const useMessageHandler = () => {
  const [message, setMessage] = useState('');

  // zustand 상태 가져오기
  const {
    userId,
    nickName,
    setUserMessage
  } = useUserStore();

  useEffect(() => {
    // 다른 유저의 메시지 수신
    socket.on('RECEIVE_MESSAGE', (msg: MessagePayload) => {
      console.log('서버로부터 메시지 수신:', msg);

      // 내가 보낸 메시지면 무시 (중복 방지)
      if (msg.userId !== userId) {
        setUserMessage(msg.content, msg.nickName ?? ''); // sender 포함
      }
    });

    return () => {
      socket.off('RECEIVE_MESSAGE');
    };
  }, [userId, setUserMessage]);

  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      const payload: MessagePayload = {
        userId,
        nickName,
        content: message,
        timestamp: new Date().toISOString(),
      };

      // 상태 먼저 반영
      setUserMessage(message, nickName);

      // 서버로 전송
      socket.emit('SEND_MESSAGE', payload);

      setMessage('');
    }
  };

  return { message, setMessage, sendMessage };
};
