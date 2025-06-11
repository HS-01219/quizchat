import { useEffect } from "react";
import { socket } from "./socketManager";
import { useQuizStore } from "@/store/useQuizStore";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";

export const useQuizHandler = () => {
  // const [answer, setAnswer] = useState<string>("");
  const { showQuizQuestion, setQuizResult } = useQuizStore();
  const { addSystemMessage } = useChatStore();
  const { userId } = useUserStore();
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  useEffect(() => {
    socket.on("START_QUIZ", startQuiz);
    socket.on("START_QUIZ_ERROR", responseMessage);
    socket.on("ANSWER_QUIZ_ERROR", responseMessage);
    socket.on("END_QUIZ", endQuiz);

    return () => {
      socket.off("START_QUIZ", startQuiz);
      socket.off("START_QUIZ_ERROR", responseMessage);
      socket.off("ANSWER_QUIZ_ERROR", responseMessage);
      socket.off("END_QUIZ", endQuiz);
    };
  }, []);

  const startQuiz = (data: { question: string }) => {
    console.log(`퀴즈 시작 - 문제 : ${data.question}`);
    showQuizQuestion(data.question);
    addSystemMessage({ type: "quizStart", time: getCurrentTime() });
  };

  const endQuiz = (data: {
    winnerId: number;
    winnerNickName: string;
    answer: string;
  }) => {
    console.log(
      `퀴즈 종료 - 정답자 : ${data.winnerNickName}, 정답 : ${data.answer}`
    );
    // 정답의 경우 여러 키워드를 '/'로 구분하여 전달합니다.

    // 프론트 TODO : 화면 상단의 퀴즈 삭제, 채팅에 퀴즈 종료 알림 전달
    setQuizResult(data.winnerNickName, data.answer); 
    addSystemMessage({
      type: "correct",
      nickName: data.winnerNickName,
      time: getCurrentTime(),
    });
  };

  const requestStartQuiz = () => {
    console.log("퀴즈 시작 요청");
    socket.emit("START_QUIZ");
  };

  const requestAnswer = (answer : string) => {
    console.log(`퀴즈 정답 제출 : ${answer}`);
    socket.emit("ANSWER_QUIZ", { userId: userId, answer: answer });
  };

  const responseMessage = (data: { message: string }) => {
    alert(data.message);
  };

  return { startQuiz, requestStartQuiz, requestAnswer };
};
