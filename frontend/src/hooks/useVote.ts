
import { useModalStore } from "@/store/useModalStore";
import { useVoteStore } from "@/store/useVoteStore";

export const useVote = () => {
	const { closeModal } = useModalStore();
	const { isSave, setIsSave } = useVoteStore();

	const save = async (data: any) => {
		console.log("save", data);
		setIsSave(true);
	};

	const edit = async (id: number, data: any) => {
		console.log("edit", id, data);
		setIsSave(false);

	};

	const cancel = () => {
		closeModal("vote");
		setIsSave(false);
	};

	return { isSave, save, edit, cancel };
};