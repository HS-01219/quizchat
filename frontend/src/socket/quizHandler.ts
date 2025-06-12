import { socket } from "./socketManager";
import { useQuizStore } from "@/store/useQuizStore";
import { useUserStore } from "@/store/useUserStore";
import { QuizState } from "@/common/types";
import { useChatStore } from "@/store/useChatStore";

let isInitialized = false;

// 소켓 이벤트 리스너 한 번만 등록
export const initializeQuizSocket = () => {
  if (isInitialized) return;
  isInitialized = true;

  const { setQuizState, setQuizResult } = useQuizStore.getState();
  const { setSystemMessages } = useChatStore.getState();

  socket.on("SYSTEM_MESSAGE", (msg) => {
    setSystemMessages(msg);
});
  
  const startQuiz = (data: QuizState) => {
    setQuizState(data);
  };

  const endQuiz = (data: {
    winnerId: number;
    winnerNickName: string;
    answer: string;
  }) => {
    setQuizResult(data.winnerNickName, data.answer);
    setQuizState(null);
  };

  const responseMessage = (data: { message: string }) => {
    alert(data.message);
  };

  socket.on("START_QUIZ", startQuiz);
  socket.on("START_QUIZ_ERROR", responseMessage);
  socket.on("ANSWER_QUIZ_ERROR", responseMessage);
  socket.on("END_QUIZ", endQuiz);
};

export const requestStartQuiz = () => {
  socket.emit("START_QUIZ");
};

export const requestAnswer = (answer: string) => {
  const { userId } = useUserStore.getState();
  socket.emit("ANSWER_QUIZ", { userId, answer });
};
