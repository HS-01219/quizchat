import { useState } from "react";

type ModalType = 'quiz' | 'nickname' | 'vote';

type ModalState = {
	[key in ModalType]: boolean;
};

const defaultModalState: ModalState = {
	quiz: false,
	nickname: false,
	vote: false,
};

export const useModal = () => {
	const [isOpenModal, setIsOpenModal] = useState<ModalState>(defaultModalState);

	const toggleModal = (type: ModalType) => {
		setIsOpenModal((prev) => ({
			...prev,
			[type]: !prev[type],
		}));
	};

	const closeModal = (type: ModalType) => {
		setIsOpenModal((prev) => ({
			...prev,
			[type]: false,
		}));
	};

	const openModal = (type: ModalType) => {
		setIsOpenModal((prev) => ({
			...prev,
			[type]: true,
		}));
	};

	return { isOpenModal, toggleModal, closeModal, openModal };
};