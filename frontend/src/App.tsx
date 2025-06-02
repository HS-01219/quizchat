
import React, { useState } from 'react';
import { GlobalStyle } from "@/styles/global";
import { Global } from "@emotion/react";
import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme";
import { Outlet } from "react-router-dom";
import Layout from "@/components/layout/layout";
import UserNameChange from "@/components/modal/userNameChange/userNameChange";
import { useUserStore } from "@/store/useUserStore";
import { useUserHandler } from "@/socket/userHandler";

const App: React.FC = () => {
  const { nickname, setNickName } = useUserStore();
  const { requestJoinRoom } = useUserHandler();

  const [isModalOpen, setIsModalOpen] = useState(!nickname);

  const handleSave = (newName: string) => {
    setNickName(newName);
    requestJoinRoom(newName);
    setIsModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Global styles={GlobalStyle} />
      {isModalOpen ? (
        <UserNameChange onClose={() => {}} onSave={handleSave} />
      ) : (
        <Layout>
          <Outlet />
        </Layout>
      )}
    </ThemeProvider>
  );
};

export default App;