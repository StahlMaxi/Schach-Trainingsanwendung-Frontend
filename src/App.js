import './App.css';
import styled from "styled-components";
import { useTheme } from './theme/themeContext';
import { useState, useEffect } from 'react';
import { NavBar } from './components/navbar';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { HomePage } from './components/pages/loggedIn/home';
import { LearningPage } from './components/pages/loggedIn/learning';
import { TrainingPage } from './components/pages/loggedIn/training';
import { HomePageLO } from './components/pages/loggedOut/homeLO';
import { LoginPage } from './components/pages/login';
import { RegistrationPage } from './components/pages/registration';
import { LearningPageLO } from './components/pages/loggedOut/learningLO';
import { TrainingPageLO } from './components/pages/loggedOut/trainingLO';

const AppContainer = styled.div`
  min-width: 375px;
  max-width: 2560px;
`;

const Content = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
`;

function App() {
  const { theme } = useTheme();

  const [userName, setUserName] = useState("");

  const [isLoggedIn, setLoggedIn] = useState(false);

  const [navBarOpen, setNavBarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkValidToken();
  }, []); 

  function checkValidToken() {
    const itemStr = localStorage.getItem('token');
    if (!itemStr) return;
  
    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem('token');
      return;
    }
    
    setLoggedIn(true);
  }

  const handleLogOut = () => {
    setLoggedIn(false);
    setUserName("");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <AppContainer theme={theme}>
      <NavBar setNavBarOpen={setNavBarOpen} isLoggedIn={isLoggedIn} userName={userName} handleLogOut={handleLogOut}/>
      {!navBarOpen && <Content>
        <Routes>
          <Route path="/" element={isLoggedIn ? <HomePage/> : <HomePageLO/>}/>
          <Route path="/learn" element={isLoggedIn ? <LearningPage handleLogOut={handleLogOut}/> : <LearningPageLO/>}/>
          <Route path="/train/:openingID?/:variantName?" element={isLoggedIn ? <TrainingPage /> : <TrainingPageLO />}/>
          <Route path="/login" element={!isLoggedIn ? <LoginPage setLoggedIn={setLoggedIn} setUser={setUserName}/> : null}/>
          <Route path="/register" element={!isLoggedIn ? <RegistrationPage/> : null}/>
          <Route path="*" element={<Navigate to="/"/>}></Route>
        </Routes>
      </Content>}
    </AppContainer>
  );
}

export default App;