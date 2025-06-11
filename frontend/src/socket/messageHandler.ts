import { useEffect } from "react";
import { socket } from "./socketManager";
import type { SystemMessageProps } from "../common/types";
import { useUserStore } from "@/store/useUserStore";
import { useChatStore } from "@/store/useChatStore"; 

interface MessagePayload {
  userId: number;
  nickName: string;
  content: string | { content: string };
  timestamp: string;
}

export const useMessageHandler = () => {
  const {
    userId,
    nickName,
    setUserMessage
  } = useUserStore();

  const { setSystemMessages } = useChatStore();

  useEffect(() => {
    // 유저 채팅 메시지 수신
    socket.on("RECEIVE_MESSAGE", (msg: MessagePayload) => {
      console.log("서버로부터 메시지 수신:", msg);

      // 내가 보낸 메시지면 무시 (중복 방지)
      if (msg.userId !== userId) {
        let actualContent = "";

        if (typeof msg.content === "string") {
          actualContent = msg.content;
        } else if (
          typeof msg.content === "object" &&
          "content" in msg.content
        ) {
          actualContent = msg.content.content;
        } else {
          console.warn("Invalid content structure:", msg.content);
          actualContent = "[잘못된 메시지 형식]";
        }

        setUserMessage(actualContent, msg.nickName ?? "", msg.userId);
      }
    });

    // 시스템 메시지 수신
    socket.on("RECEIVE_SYSTEM_MSG", (msg: SystemMessageProps) => {
      console.log("서버로부터 시스템 메시지 수신:", msg);
        if (!msg || !msg.type) {
    console.warn("⚠️ 시스템 메시지 형식이 이상함:", msg);
  }
      setSystemMessages(msg);
    });

    return () => {
      socket.off("RECEIVE_MESSAGE");
      socket.off("RECEIVE_SYSTEM_MSG");
    };
  }, [userId, setUserMessage, setSystemMessages]);

  // 유저 메시지 전송
  const sendMessage = (msg: string) => {
    if (socket && msg.trim() !== "") {
      const payload: MessagePayload = {
        userId,
        nickName,
        content: msg,
        timestamp: new Date().toISOString(),
      };

      console.log("보낼 메시지:", payload);

      setUserMessage(msg, nickName, userId);
      socket.emit("SEND_MESSAGE", payload);
    }
  };

  // 시스템 메시지 전송
  const sendSystemMessage = (msg: SystemMessageProps) => {
    console.log("시스템 메시지 전송 요청:", msg); 
    socket.emit("REQUEST_SYSTEM_MSG", msg);
  };

  return { sendMessage, sendSystemMessage };
};
