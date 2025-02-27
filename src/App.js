import './App.css';
import styled from "styled-components";
import { NavBar } from './components/navbar';
import { useState } from 'react';

const AppContainer = styled.div`
  min-width: 340;
  max-width: 2560px;
`;

function App() {
  const [isDarkMode, setDarkMode] = useState(false);

  return (
    <AppContainer>
      <NavBar isDarkMode={isDarkMode}/>
    </AppContainer>
  );
}

export default App;