import { useEffect } from 'react';
import { socket } from './socketManager';
import type { SystemMessageProps } from '../common/types';
import { useUserStore } from "@/store/useUserStore";
export const useMessageHandler = () => {

  interface MessagePayload {
  userId: number;
  nickName: string;
  content: string | { content: string }; 
  timestamp: string;
}

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

      if (msg.userId !== userId) {
          let actualContent = '';

        if (typeof msg.content === 'string') {
          actualContent = msg.content;
        } else if (typeof msg.content === 'object' && 'content' in msg.content) {
          actualContent = msg.content.content;
        } else {
          console.warn("Invalid content structure:", msg.content);
          actualContent = '[잘못된 메시지 형식]';
        }

        setUserMessage(actualContent, msg.nickName ?? '', msg.userId);
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

  const sendMessage = (msg : string) => {
    if (socket && msg.trim() !== '') {
      
      const payload: MessagePayload = {
        userId,
        nickName,
        content:msg,
        timestamp: new Date().toISOString(),
      };
      console.log('보낼 메시지:', payload);
      setUserMessage(msg, nickName, userId);

      // 서버로 전송
      socket.emit('SEND_MESSAGE', payload);
    }
  };
  
  const sendSystemMessage = (msg : SystemMessageProps) => {
      // 서버로 시스템 메시지 요청
      socket.emit('REQUEST_SYSTEM_MSG', msg);
  }

  return { sendMessage, sendSystemMessage };
};

