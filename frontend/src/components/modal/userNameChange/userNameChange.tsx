import React, { useState } from "react";
import * as S from "./userNameChange.style";
import {useUserStore} from "@/store/useUserStore";
import {useUserHandler} from "@/socket/userHandler";

interface UserNameChangeProps {
  onClose: () => void;
  onSave: (newName: string) => void;
}

const UserNameChange = ({ onClose, onSave }: UserNameChangeProps) => {
  const [input, setInput] = useState("");
  const { nickname, setNickName } = useUserStore();
  const {updateNickName} = useUserHandler();
  const handleSave = () => {
    const trimmedInput = input.trim();

    if (trimmedInput === '') {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setNickName(trimmedInput);
    updateNickName(trimmedInput);
    onSave(trimmedInput);

    onClose();
  };
  return (
    <S.Modal>
      <S.ModalContainer>
        <S.ModalTitle>사용할 닉네임을 입력해주세요</S.ModalTitle>
        <S.ModalInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="닉네임 입력"
        />
        <S.ConfirmButton onClick={handleSave}>완료</S.ConfirmButton>
      </S.ModalContainer>
    </S.Modal>
  );
};

export default UserNameChange;