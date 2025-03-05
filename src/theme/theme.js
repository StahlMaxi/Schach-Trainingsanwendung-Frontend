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
    background: '#F8F9FA',
    card: '#FFFFFF',
    navbar: '#F1F3F5',
    // Text
    text: '#212529',
    secText: '#6C757D',
    placeHolder: '#ADB5BD',
    // IconButtons
    iconButton: '#6C757D',
    iconHover: '#495057',
    active: '#2ECC71',
  },
  typography: commonTypography,
  mui: createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#6C757D' },  //iconButton
      background: { 
        default: '#F8F9FA',  //background
        paper: '#FFFFFF',    //card
      },
      text: { 
        primary: '#212529',   //text
        secondary: '#6C757D', //secText
        disabled: '#ADB5BD',  //placeHolder
      },
      action: {
        active: '#2ECC71', //active
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
    card: '#1E1E1E',
    navbar: '#242424',
    //Text
    text: '#E0E0E0',
    secText: '#B0B0B0',
    placeHolder: '#8D8D8D',
    //IconButtons
    iconButton: '#B0B0B0',
    iconHover: '#E0E0E0',
    active: '#2ecc71',
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
        active: '#2ecc71', //active
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