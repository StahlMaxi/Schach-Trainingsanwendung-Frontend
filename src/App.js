import './App.css';
import styled from "styled-components";
import { useTheme } from './theme/themeContext';
import { NavBar } from './components/navbar';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './components/pages/home';
import { LearningPage } from './components/pages/learning';
import { TrainingPage } from './components/pages/training';
import { SettingPage } from './components/pages/settings';

const AppContainer = styled.div`
  min-width: 340;
  max-width: 2560px;
`;

function App() {
  const { theme } = useTheme();

  return (
    <AppContainer theme={theme}>
      <NavBar/>
      <div className='container'>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/learn" element={<LearningPage/>}/>
          <Route path="/train" element={<TrainingPage/>}/>
          <Route path="/settings" element={<SettingPage/>}/>
        </Routes>
      </div>
    </AppContainer>
  );
}

export default App;