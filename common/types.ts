// 투표 관련
export interface StartVotePayload {
    title: string;
    items: string[];
    isMultiple: boolean;
}

export interface VoteItem { // 각 항목 식별 id, 내용, 투표 수
    itemId: string;
    text: string;
    count: number;
};

export interface VoteState { // 투표 제목, 항목, 현재 유효한지 여부, 중복 가능 여부
    title: string;
    items: VoteItem[];
    isActive: boolean;
    isMultiple: boolean;
};

export interface QuizItem { // 퀴즈 id, 문제, 정답
    id : number;
    question : string;
    answer : string;
}

export interface QuizState {
    isActive : boolean;
    quizData : QuizItem | null;
}