import styled from "@emotion/styled";

export const ChatSystemMessageContainer = styled.div(({ theme }) => ({
	width:'100%',
	color:theme.color.gray30,
	fontSize: theme.fontSize.s,
	display: 'flex',
	padding: '0.25rem',
	justifyContent: 'center',
}))