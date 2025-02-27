import './App.css';
import styled from "styled-components";
import { NavBar } from './components/navbar';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './components/pages/home';
import { LearningPage } from './components/pages/learning';
import { TrainingPage } from './components/pages/training';

const AppContainer = styled.div`
  min-width: 340;
  max-width: 2560px;
`;

function App() {
  const [isDarkMode, setDarkMode] = useState(false);

  return (
    <AppContainer>
      <NavBar isDarkMode={isDarkMode}/>
      <div className='container'>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/learn" element={<LearningPage/>}/>
          <Route path="/train" element={<TrainingPage/>}/>
        </Routes>
      </div>
    </AppContainer>
  );
}

export default App;