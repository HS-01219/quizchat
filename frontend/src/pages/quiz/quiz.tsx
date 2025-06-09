import React, { useEffect } from "react";
import SystemMessage from "@/components/systemMessage/SystemMessage";
import BubbleHeader from "@/components/bubbleHeader/bubbleHeader";
import { useQuizStore } from "@/store/useQuizStore";
import { useChatStore } from "@/store/useChatStore";

const Quiz = () => {
  const {
    question,
    isActive,
    winnerNickName,
    correctAnswer,

    showQuizQuestion,
    setQuizResult,
  } = useQuizStore();

  const { systemMessages, addSystemMessage  } = useChatStore();

  const headerQuestion = isActive && question ? question : "퀴즈가 없습니다";

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  // 테스트용 퀴즈
  useEffect(() => {
    showQuizQuestion("프론트에서 테스트 중인 퀴즈 문제입니다.");
    addSystemMessage({ type: "quizStart", time: getCurrentTime() });

    // 5초 후 정답자 표시 테스트
    setTimeout(() => {
      setQuizResult("홍길동", "1");
      addSystemMessage({ type: "correct", nickName: "홍길동", time: getCurrentTime() });
    }, 5000);
    
  }, []);

  return (
    <>
      <BubbleHeader type="quiz" question={headerQuestion} time={getCurrentTime()} />

      {/* {!isActive && (
        <SystemMessage
          type="quizStart"
          time={getCurrentTime()}
        />
      )} */}

      {systemMessages.map((msg, index) => (
        <SystemMessage
          key={index}
          type={msg.type}
          nickName={msg.nickName}
          time={msg.time}
        />
      ))}
    </>
  );
};

export default Quiz;
