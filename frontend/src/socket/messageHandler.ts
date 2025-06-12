import { useEffect } from "react";
import { socket } from "./socketManager";
import type { MessagePayload, SystemMessageProps } from "../common/types";
import { useUserStore } from "@/store/useUserStore";
import { useChatStore } from "@/store/useChatStore"; 

export const sendSystemMessage = (msg: SystemMessageProps) => {
  console.log("시스템 메시지 전송 요청:", msg); 
  socket.emit("REQUEST_SYSTEM_MSG", msg);
};

export const useMessageHandler = () => {
  const {
    userId,
    nickName,
    setUserMessage
  } = useUserStore();

  const { setSystemMessages } = useChatStore();

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", (msg: MessagePayload) => {
      console.log("서버로부터 메시지 수신:", msg);

      if (msg.userId !== userId) {
        // let actualContent = "";
        // actualContent = msg.content;
        // if (typeof msg.content === "string") {
        //   actualContent = msg.content;
        // } else if (
        //   typeof msg.content === "object" &&
        //   "content" in msg.content
        // ) {
        //   actualContent = msg.content;
        // } else {
        //   console.warn("Invalid content structure:", msg.content);
        //   actualContent = "[잘못된 메시지 형식]";
        // }

        // setUserMessage(actualContent, msg.nickName ?? "", msg.userId);
        setUserMessage(msg);
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

  const sendMessage = (msg: string) => {
    if (socket && msg.trim() !== "") {
      const payload: MessagePayload = {
        userId,
        nickName,
        content: msg,
        timestamp: Date.now(),
      };
      console.log('보낼 메시지:', payload);

      // setUserMessage(msg, nickName, userId);
      setUserMessage(payload);
      socket.emit("SEND_MESSAGE", payload);
    }
  };

  return { sendMessage };
};
