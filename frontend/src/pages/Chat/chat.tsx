import SystemMessage from "@/components/systemMessage/SystemMessage";
import { ChatContainer } from "./chat.style";
import ChatSystemMessage from "@/components/systemMessage/chatSystemMessage/chatSystemMessage";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import ChatUserMessage from "@/components/systemMessage/chatUserMessage/chatUserMessage";
import { useEffect, useRef, useMemo } from "react";
import { MessageType, SystemMessageProps, VoteItem } from "@/common/types";

interface ChatSystemMessage {
  content: string;
  time: string;
}

interface SystemMsg extends SystemMessageProps {
  type: MessageType;
  nickName?: string;
  time: string;
  items?: VoteItem[];
}

interface UserMsg {
  content: string;
  sender?: string;
  time: string;
  userId?: number;
}

type MessageWithMeta =
  | { source: "chatSystem"; message: ChatSystemMessage; timestamp: number }
  | { source: "system"; message: SystemMsg; timestamp: number }
  | { source: "user"; message: UserMsg; timestamp: number };

const Chat = () => {
  const { systemMessages } = useChatStore();

  const userMessages = useUserStore((state) => state.userMessages);
  const chatSystemMessages = useUserStore((state) => state.systemMessages);
  const containerRef = useRef<HTMLDivElement>(null);

  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T/;

  const parseKoreanTimeToDate = (timeStr: string): Date => {
    const [ampm, time] = timeStr.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (ampm === "오후" && hour !== 12) hour += 12;
    if (ampm === "오전" && hour === 12) hour = 0;

    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
      0
    );
  };

  const parse24hTimeToDate = (timeStr: string): Date => {
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
      0
    );
  };

  // 오버로드 선언
  function parseAndIndex(arr: ChatSystemMessage[], source: "chatSystem"): MessageWithMeta[];
  function parseAndIndex(arr: SystemMsg[], source: "system"): MessageWithMeta[];
  function parseAndIndex(arr: UserMsg[], source: "user"): MessageWithMeta[];
  // 구현부
  function parseAndIndex(
    arr: (ChatSystemMessage | SystemMsg | UserMsg)[],
    source: "chatSystem" | "system" | "user"
  ): MessageWithMeta[] {
    return arr.map((msg, idx) => {
      let baseDate: Date;
      // if (iso8601Regex.test(msg.time)) {
      //   baseDate = new Date(msg.time);
      // } else if (source === "system") {
      //   baseDate = parse24hTimeToDate(msg.time);
      // } else {
      //   baseDate = parseKoreanTimeToDate(msg.time);
      // }

      // 중복 타임스탬프 방지용 idx 추가 (1ms씩)
      return {
        source,
        message: msg as any,
        timestamp: Date.now(),
      };
    });
  }

  const sortedMessages = useMemo(() => {
    const chatSysMsgs = parseAndIndex(chatSystemMessages, "chatSystem");
    const sysMsgs = parseAndIndex(systemMessages, "system");
    const userMsgs = parseAndIndex(userMessages, "user");

    const combined = [...chatSysMsgs, ...sysMsgs, ...userMsgs];

    // console.log('before:' , combined);
  
    return combined.sort((a, b) => a.timestamp - b.timestamp);
    // console.log('after:', ret)
    // return ret;

  }, [chatSystemMessages, systemMessages, userMessages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [sortedMessages]);

  return (
    <ChatContainer ref={containerRef}>
      {sortedMessages.map((entry, idx) => {
        switch (entry.source) {
          case "chatSystem":
            return <ChatSystemMessage key={idx} message={entry.message} />;
          case "system":
            return (
              <SystemMessage
                key={idx}
                type={entry.message.type}
                nickName={entry.message.nickName}
                time={entry.message.time}
                items={entry.message.items}
              />
            );
          case "user":
            return <ChatUserMessage key={idx} message={entry.message} />;
          default:
            return null;
        }
      })}
    </ChatContainer>
  );
};

export default Chat;
