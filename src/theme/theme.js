import { createTheme } from '@mui/material/styles';

const commonTypography = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 16,
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 300,
  }
};

export const lightTheme = {
  name: 'light',
  colors: {
    background: '#FFFFFF',
    backgroundCounter: '#000000',
    card: '#FFFFFF',
    navbar: '#FFFFFF',  
    // Text
    text: '#212529',
    textCounter: '#E0E0E0',
    secText: '#6C757D',
    placeHolder: '#ADB5BD',
    // IconButtons
    iconButton: '#6C757D',
    iconHover: '#495057',
    active: '#2ECC71',
    //List
    hover: '#f1f3f5',
    counterHover: '#333333',
    selected: '#e3f2fd',
    selectedHover: '#bbdefb',
  },
  typography: commonTypography,
  mui: createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#6C757D' },  //iconButton
      background: { 
        default: '#FFFFFF',  //background
        paper: '#FFFFFF',    //card
      },
      text: { 
        primary: '#212529',   //text
        secondary: '#6C757D', //secText
        disabled: '#ADB5BD',  //placeHolder
      },
      action: {
        hover: '#495057',  //iconHover
      },
    },
    typography: commonTypography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: '#212529',
            borderColor: '#212529',
            fontFamily: commonTypography.fontFamily,
            fontSize: commonTypography.fontSize,
            cursor: 'pointer',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#212529',
            fontSize: '1.5rem',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          },
        },
      },
    },
  }),
};

export const darkTheme = {
  name: 'dark',
  colors: {
    background: '#121212',
    backgroundCounter: '#F8F9FA',
    card: '#1E1E1E',
    navbar: '#242424',
    //Text
    text: '#E0E0E0',
    textCounter: '#212529',
    secText: '#B0B0B0',
    placeHolder: '#8D8D8D',
    //IconButtons
    iconButton: '#B0B0B0',
    iconHover: '#E0E0E0',
    //List
    hover: '#333333',
    counterHover: '#b0b0b0',
    selected: '#3a3a3a',
    selectedHover: '#4a4a4a',
  },
  typography: commonTypography,
  mui: createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#B0B0B0' },  //iconButton
      background: { 
        default: '#121212',  //background
        paper: '#1E1E1E',    //card
      },
      text: { 
        primary: '#E0E0E0',   //text
        secondary: '#B0B0B0', //secText
        disabled: '#8D8D8D',  //placeHolder
      },
      action: {
        hover: '#E0E0E0',  //iconHover
      },
    },
    typography: commonTypography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: '#E0E0E0',
            borderColor: '#E0E0E0',
            fontFamily: commonTypography.fontFamily,
            fontSize: commonTypography.fontSize,
            cursor: 'pointer',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#E0E0E0',
            fontSize: '1.5rem',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#333333',
            },
          },
        },
      },
    },
  }),
};