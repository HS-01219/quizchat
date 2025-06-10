import styled from "@emotion/styled";

export const ChatMessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-end;
  padding: 1rem;
`;

export const ChatContainer = styled.div`
    flex: 1; 
    overflow: auto;
    display: flex;
    flex-direction: column;
    max-height: 100%;`