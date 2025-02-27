import { createTheme } from '@mui/material/styles';

const commonTypography = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 16,
  h1: {
    fontSize: '2rem',
    fontWeight: 700,
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
  },
};

export const lightTheme = {
  name: 'light',
  colors: {
    primary: '#007bff',
    background: '#ffffff',
    text: '#000000',
  },
  typography: commonTypography,
  mui: createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#007bff' },
      background: { default: '#ffffff', paper: '#f8f9fa' },
      text: { primary: '#000000' },
    },
    typography: commonTypography,
  }),
};

export const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#90caf9',
    background: '#121212',
    text: '#ffffff',
  },
  typography: commonTypography,
  mui: createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#90caf9' },
      background: { default: '#121212', paper: '#1e1e1e' },
      text: { primary: '#ffffff' },
    },
    typography: commonTypography,
  }),
};