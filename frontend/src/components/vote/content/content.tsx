import React, { ChangeEvent } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import * as S from "./content.style";
import Button from "@/components/button/button";
import InputWithIcon from "@/components/vote/Input/input";
import RadioBtn from "@/components/radioBtn/radioBtn";

import { useVote } from "@/hooks/useVote";
import { useVoteStore } from "@/store/useVoteStore";

const Content = () => {
	const { save, edit, vote } = useVote();

	const {
		title,
		voteItems,
		deleteVoteItem,
		isSave,
		isDuplicated,
		setTitle,
		setVoteItems,
		selectedVoteId,
	} = useVoteStore();

	const handleItemChange = (id: number, value: string) => {
		if (isSave) return;
		setVoteItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, text: value } : item))
		);
	};

	const handleItemDelete = (id: number) => {
		deleteVoteItem(id);
	};

	const addVoteItem = () => {
		if (isSave) return;
		setVoteItems((prev) => [...prev, { id: Date.now(), text: "" }]);
	};

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (isSave) return;
		setTitle(e.target.value);
	};

	const onSaveClick = () => {
		const data = {
			title,
			items: voteItems.map((item) => item.text),
			isDuplicated,
		};
		save(data);
	};

	const onEdit = () => {
		const data = {
			title,
			items: voteItems.map((item) => item.text),
			isDuplicated,
		};
		edit(123, data);
	};

	const onVote = (itemId: number) => {
		if (isSave) {
			vote(itemId);
		}
	};

	return (
		<S.VoteInputContainer>
			<InputWithIcon
				inputComponent={S.LargeInput}
				placeholder="제목"
				value={title}
				onChange={handleTitleChange}
				readOnly={isSave}
			/>

			{voteItems.map((item, index) => (
				<InputWithIcon
					key={item.id}
					readOnly={isSave}
					isSelected={selectedVoteId.includes(item.id)}
					inputComponent={S.MediumInput}
					placeholder={`항목 ${index + 1}`}
					value={item.text}
					onChange={(e) => {
						if (!isSave) handleItemChange(item.id, e.target.value);
					}}
					onClick={() => onVote(item.id)}
					icon={
						!isSave && voteItems.length > 2 ? (
							<IoIosCloseCircleOutline
								onClick={() => handleItemDelete(item.id)}
								style={{ cursor: "pointer" }}
							/>
						) : null
					}
				/>
			))}

			{!isSave && (
				<S.AddText onClick={addVoteItem}>+ 항목 추가</S.AddText>
			)}
			<RadioBtn />
			<S.ButtonWrapper>
				<Button onClick={isSave ? onEdit : onSaveClick}>
					{isSave ? "수정" : "완료"}
				</Button>
			</S.ButtonWrapper>
		</S.VoteInputContainer>
	);
};

export default Content;