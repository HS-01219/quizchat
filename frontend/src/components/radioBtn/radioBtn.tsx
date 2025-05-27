import React from "react";
import * as S from "./radioBtn.style";

const RadioButton = () => {
	return (
		<S.RadioWrapper>
			<S.RadioInput type="radio" id="r1" name="rr" />
			<S.RadioLabel htmlFor="r1">
				중복 선택
			</S.RadioLabel>
		</S.RadioWrapper>
	);
};

export default RadioButton;