import { useEffect, useState } from 'react';
import { socket } from './socketManager';
import type { MessagePayload, SystemMessageProps } from '../common/types';
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
        setUserMessage(msg.content, msg.nickName ?? '', msg.userId); // sender 포함
      }
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
      setUserMessage(message, nickName, userId);

      // 서버로 전송
      socket.emit('SEND_MESSAGE', payload);

      setMessage('');
    }
  };
  
  const sendSystemMessage = (msg : SystemMessageProps) => {
      // 서버로 시스템 메시지 요청
      socket.emit('REQUEST_SYSTEM_MSG', msg);
  }

  return { message, setMessage, sendMessage, sendSystemMessage };
};
