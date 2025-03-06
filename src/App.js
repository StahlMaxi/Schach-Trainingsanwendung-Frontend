import './App.css';
import styled from "styled-components";
import { useTheme } from './theme/themeContext';
import { useState } from 'react';
import { NavBar } from './components/navbar';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './components/pages/loggedIn/home';
import { LearningPage } from './components/pages/loggedIn/learning';
import { TrainingPage } from './components/pages/loggedIn/training';
import { SettingPage } from './components/pages/loggedIn/settings';
import { HomePageLO } from './components/pages/loggedOut/homeLO';
import { LoginPage } from './components/pages/login';
import { RegistrationPage } from './components/pages/registration';
import { Navigate } from 'react-router-dom';
import { LearningPageLO } from './components/pages/loggedOut/learningLO';
import { TrainingPageLO } from './components/pages/loggedOut/trainingLO';
import { SettingPageLO } from './components/pages/loggedOut/settingsLO';

const AppContainer = styled.div`
  min-width: 375px;
  max-width: 2560px;
`;

function App() {
  const { theme } = useTheme();

  const [isLoggedIn, setLoggedIn] = useState(false);

  const [navBarOpen, setNavBarOpen] = useState(false);

  return (
    <AppContainer theme={theme}>
      <NavBar setNavBarOpen={setNavBarOpen}/>
      {!navBarOpen && <div className='container'>
        <Routes>
          <Route path="/" element={isLoggedIn ? <HomePage/> : <HomePageLO/>}/>
          <Route path="/learn" element={isLoggedIn ? <LearningPage/> : <LearningPageLO/>}/>
          <Route path="/train" element={isLoggedIn ? <TrainingPage/> : <TrainingPageLO/>}/>
          <Route path="/settings" element={isLoggedIn ? <SettingPage/> : <SettingPageLO/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegistrationPage/>}/>
          <Route path="*" element={<Navigate to="/"/>}></Route>
        </Routes>
      </div>}
    </AppContainer>
  );
}

export default App;