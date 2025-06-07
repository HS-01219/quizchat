import { useModalStore } from "@/store/useModalStore";
import { useVoteStore } from "@/store/useVoteStore";
import { useVoteHandler } from "@/socket/voteHandler";
import {useUserStore} from "@/store/useUserStore";

export const useVote = () => {
	const { closeModal } = useModalStore();
	const {
		isSave,
		setIsSave,
		setIsTimerActive,
		resetVote,
		setSelectedVoteId,
		isDuplicated,
		selectedVoteId,
		setCurrentUserId,
		setVoteCreatorId,
	} = useVoteStore();
	const { userId } = useUserStore();
	const { startVote, submitVote, endVote } = useVoteHandler();

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
			setIsSave(true);
			closeModal("vote");
			setIsTimerActive(true);
			startVote(data);
	setVoteCreatorId(userId);
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
		console.log("투표 취소");
		closeModal("vote");
		resetVote();
	};

	const vote = (id: number) => {
		console.log("투표 항목 선택:", id);
		if (isDuplicated) {
			setSelectedVoteId((prev) =>
				prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
			);
		} else {
			setSelectedVoteId(() => [id]);
			setCurrentUserId(userId);
		}

		const newSelectedIds = isDuplicated
			? selectedVoteId.includes(id)
				? selectedVoteId.filter((v) => v !== id)
				: [...selectedVoteId, id]
			: [id];

		submitVote(newSelectedIds);
	};

	const voteEnd = () => {
		endVote();
	};

	return {
		isSave,
		save,
		edit,
		cancel,
		vote,
	voteEnd
	};
};