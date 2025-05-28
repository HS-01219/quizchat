import React, { ChangeEvent, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import * as S from "./content.style";
import Button from "@/components/button/button";
import InputWithIcon from "@/components/vote/Input/input";
import RadioBtn from "@/components/radioBtn/radioBtn";
import { useVote } from "@/hooks/useVote";
interface VoteItem {
	id: number;
	text: string;
}

const Content = () => {
	const [voteItems, setVoteItems] = useState<VoteItem[]>([
		{ id: Date.now(), text: "" },
	]);
	const { cancel } = useVote();
	const handleItemChange = (id: number, value: string) => {
		setVoteItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, text: value } : item))
		);
	};

	const handleItemDelete = (id: number) => {
		setVoteItems((prev) => prev.filter((item) => item.id !== id));
	};

	const addVoteItem = () => {
		setVoteItems((prev) => [...prev, { id: Date.now(), text: "" }]);
	};

	return (
		<S.VoteInputContainer>
			<InputWithIcon
				inputComponent={S.LargeInput}
				placeholder="제목"
			/>
			<InputWithIcon
				inputComponent={S.MediumInput}
				placeholder="항목 1"

			/>
			<InputWithIcon
				inputComponent={S.MediumInput}
				placeholder="항목 2"
			/>

			{voteItems.map((item, index) => (
				<InputWithIcon
					key={item.id}
					inputComponent={S.MediumInput}
					placeholder={`항목 ${index + 3}`}
					value={item.text}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						handleItemChange(item.id, e.target.value)
					}
					icon={
						<IoIosCloseCircleOutline
							onClick={() => handleItemDelete(item.id)}
							style={{ cursor: "pointer" }}
						/>
					}
				/>
			))}

			<S.AddText onClick={addVoteItem}>+ 항목 추가</S.AddText>
			<RadioBtn/>
<S.ButtonWrapper>
	<Button >완료</Button>
	<Button onClick={cancel}>취소</Button>
</S.ButtonWrapper>

		</S.VoteInputContainer>
	);
};

export default Content;