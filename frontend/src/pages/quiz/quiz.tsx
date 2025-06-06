import React from "react";
import SystemMessage from "@/components/systemMessage/SystemMessage";
import BubbleHeader from "@/components/bubbleHeader/bubbleHeader";
import { useQuizStore } from "@/store/useQuizStore";

const Quiz = () => {
  const {
    question,
    isActive,
    winnerNickName,
    correctAnswer,
  } = useQuizStore();

  const dummyTime = "00:30"; 

  return (
    <>
      {isActive && question && (
        <BubbleHeader type="quiz" question={question} time={dummyTime} />
      )}

      {winnerNickName && correctAnswer && (
        <SystemMessage
          type="correct"
          nickName={winnerNickName}
          time={dummyTime}
        />
      )}
    </>
  );
};

export default Quiz;