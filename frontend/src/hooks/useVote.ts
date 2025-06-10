import { useModalStore } from "@/store/useModalStore";
import { useVoteStore } from "@/store/useVoteStore";
import { useVoteHandler } from "@/socket/voteHandler";
import {useUserStore} from "@/store/useUserStore";
import {useTimerStore} from "@/store/useTimerStore";
import {useChatStore} from "@/store/useChatStore";

export const useVote = () => {
	const { closeModal } = useModalStore();
	const {
		isSave,
		setIsSave,
		voteItems,
		setIsTimerActive,
		resetVote,
		setSelectedVoteId,
		isDuplicated,
		selectedVoteId,
		setCurrentUserId,
		setVoteCreatorId,
	} = useVoteStore();
	const { userId } = useUserStore();
	const { addSystemMessage } = useChatStore();
	const { startVote, submitVote, endVote } = useVoteHandler();
	const { startTimer } = useTimerStore();

	const save = async (data: any) => {
		console.log("투표 저장:", data);
		if (!data.title.trim()) {
			alert('투표 제목을 입력해주세요.');
			return;
		}

		if (data.items.length < 2) {
			alert('투표 항목은 최소 2개 이상이어야 합니다.');
			return;
		}

		if (data.items.some((item: any) => !item.text.trim())) {
			alert('모든 투표 항목을 입력해주세요.');
			return;
		}

		try {
			setVoteCreatorId(userId);
			setIsSave(true);
			closeModal("vote");
			setIsTimerActive(true);
			startVote(data);

		startTimer()
		} catch (error) {
			console.error('투표 시작 오류:', error);
			setIsSave(false);
			setIsTimerActive(false);
			alert('투표 시작 중 오류가 발생했습니다.');
		}
	};

	const edit = async (id: number, data: any) => {
		console.log("투표 수정:", id, data);
		setIsSave(false);
		setIsTimerActive(false);
		// TODO: 투표 수정 로직 구현
	};

	const cancel = () => {
		closeModal("vote");
		resetVote();
	};

	const vote = (id: number) => {
		console.log("=== 투표 시작 ===");
		console.log("선택한 ID:", id);
		console.log("현재 선택된 항목들:", selectedVoteId);
		console.log("투표 모드:", isDuplicated ? "중복" : "단일");
		console.log("유저 아이디:", userId);

		if (isDuplicated) {
			setSelectedVoteId((prev) => {
				console.log("중복 모드 - 이전 선택:", prev);
				const updated = prev.includes(id)
					? prev.filter((v) => v !== id)
					: [...prev, id];
				submitVote(updated);
				return updated;
			});
		} else {
			const updated = [id];

			setSelectedVoteId(() => {
				return updated;
			});

			setCurrentUserId(userId);
			submitVote(updated);
		}
		console.log("=== 투표 끝 ===");
	};



	return {
		isSave,
		save,
		edit,
		cancel,
		vote,
	};
};