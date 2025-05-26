import styled from "@emotion/styled";

export const FooterUserNameContainer = styled.div(({ theme }) => ({
	display: "flex",
	width: "6.75rem",
	gap:"0.25rem",
	color: theme.color.gray50,
	textAlign: "center",
	alignItems: "center",
	justifyContent: "center",
	fontSize: theme.fontSize.s,
	fontWeight: theme.fontWeight.m,
	margin: "0.63rem",
	svg:{
		color: theme.color.darkblue,
		cursor: "pointer",
	}
}));