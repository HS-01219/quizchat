import React from "react";
import * as S from "./radioBtn.style";
import { Label } from "@/constants/label";
const RadioButton = () => {
	const [isDuplicate, setIsDuplicate] = React.useState(false);
	const handleDuplicateChange = () => {
		setIsDuplicate(!isDuplicate);
	}
	return (
		<S.RadioWrapper onClick={handleDuplicateChange}>
			<S.RadioInput type="radio" id="r1" name="rr" checked={isDuplicate} onChange={handleDuplicateChange} />
			<S.RadioLabel htmlFor="r1">
				{Label.DUPLICATE_OPTION}
			</S.RadioLabel>
		</S.RadioWrapper>
	);
};

export default RadioButton;