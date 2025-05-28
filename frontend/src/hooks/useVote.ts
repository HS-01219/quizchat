import {useModal} from "@/hooks/useModal";


export const useVote = () => {
	const {  closeModal } = useModal();
	const save = async (data) => {
		console.log("save",data);

	};
	const edit = async (id, data) => {
		console.log("Edit",id, data);

	};
	const cancel = () => {
		closeModal('quiz');

	};

	return { save, edit, cancel };
};