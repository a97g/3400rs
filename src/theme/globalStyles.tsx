/* eslint-disable react/react-in-jsx-scope */
// material
import { useTheme } from '@mui/material/styles';
import { GlobalStyles as GlobalThemeStyles } from '@mui/material';

export default function GlobalStyles() {
  const theme = useTheme();
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <GlobalThemeStyles
        styles={{
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            fontFamily: 'Poppins, sans-serif !important'
          },
          html: {
            width: '100%',
            height: '100%',
            WebkitOverflowScrolling: 'touch'
          },
          body: {
            width: '100%',
            height: '100%',
            backgroundColor: '#141316',
            color: '#fff',
          },
          '#root': {
            width: '100%',
            height: '100%',
          },
          '.navLink': {
            display: 'flex',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#fff'
          },
          input: {
            '&[type=number]': {
              MozAppearance: 'textfield',
              '&::-webkit-outer-spin-button': {
                margin: 0,
                WebkitAppearance: 'none'
              },
              '&::-webkit-inner-spin-button': {
                margin: 0,
                WebkitAppearance: 'none'
              }
            }
          },
          '&::-webkit-scrollbar': {
            scrollbarWidth: 'thin',
          },
          textarea: {
            '&::-webkit-input-placeholder': {
              color: theme.palette.text.disabled
            },
            '&::-moz-placeholder': {
              opacity: 1,
              color: theme.palette.text.disabled
            },
            '&:-ms-input-placeholder': {
              color: theme.palette.text.disabled
            },
            '&::placeholder': {
              color: theme.palette.text.disabled
            }
          },
          img: { display: 'block', maxWidth: '100%' },
          // Lazy Load Img
          '.blur-up': {
            WebkitFilter: 'blur(5px)',
            filter: 'blur(5px)',
            transition: 'filter 400ms, -webkit-filter 400ms'
          },
          '.blur-up.lazyloaded ': {
            WebkitFilter: 'blur(0)',
            filter: 'blur(0)'
          },
          '.MuiTypography-root': {
            fontFamily: 'Poppins, sans-serif'
          },
          '.MuiTypography-h1': {
            fontWeight: 300, // Light
          },
          '.MuiTypography-h2': {
            fontWeight: 300, // Light
          },
          '.MuiTypography-h3': {
            fontFamily: 'Montserrat !important',
            fontWeight: '600 !important', // Semi-bold
          },
          '.MuiTypography-h4': {
            fontWeight: 300, // Light
          },
          '.MuiTypography-h5': {
            fontWeight: 300, // Light
          },
          '.MuiTypography-h6': {
            fontWeight: 300, // Light
          }
        }}
      />
    </>
  );
}
