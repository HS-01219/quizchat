import * as S from "./chatUserMessage.style";
import React from "react";
import { useUserStore } from "@/store/useUserStore";

interface ChatUserMessageProps {
  message: {
    content: string;
    sender?: string;
    userId?: number;
    time: string;
  };
}

const ChatUserMessage: React.FC<ChatUserMessageProps> = ({ message }) => {
  const myUserId = useUserStore((state) => state.userId);
  const isMine = message.userId === myUserId;

  return (
    <S.MessageWrapper isMine={isMine}>

      <S.SenderLabel isMine={isMine}>{message.sender}</S.SenderLabel>

      <S.BubbleRow isMine={isMine}>

        <S.ChatUserMessageContainer isMine={isMine}>
          {message.content}
        </S.ChatUserMessageContainer>
        {!isMine && <S.TimeLabel isMine={isMine}>{message.time}</S.TimeLabel>}

        {isMine && <S.TimeLabel isMine={isMine}>{message.time}</S.TimeLabel>}

      </S.BubbleRow>

    </S.MessageWrapper>
  );
};

export default ChatUserMessage;
