export default {
  initialColorMode: 'light',
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#33e',
    secondary: '#63e',
    muted: '#f6f6ff',
    modes: {
      black: {
        text: '#fff',
        background: '#000',
        primary: '#69f',
      },
      dark: {
        text: '#fff',
        background: '#222224',
        primary: '#69f',
      },
    }
  },
  fonts: {
    body: 'system-ui, sans-serif',
    monospace: '"Roboto Mono", Menlo, monospace',
  },
  lineHeights: {
    body: 1.625,
    heading: 1.25,
  },
  fontWeights: {
    body: 400,
    heading: 800,
    bold: 700,
  },
  fontSizes: [
    14, 16, 18, 20, 24, 32, 48, 64, 72
  ],
  sizes: {
    container: 768,
  },
  type: {
    heading: {
      fontWeight: 'heading',
      lineHeight: 'heading',
      mt: 4,
      mb: 3,
    },
    small: {
      fontWeight: 'bold',
      fontSize: 0,
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontSize: 2,
    },
    a: {
      color: 'primary',
    },
    h1: {
      variant: 'type.heading',
      fontSize: [5, 6],
    },
    h2: {
      variant: 'type.heading',
      fontSize: [4, 5],
    },
    h3: {
      variant: 'type.heading',
      fontSize: 4,
    },
    h4: {
      variant: 'type.heading',
      fontSize: 2,
    },
    h5: {
      variant: 'type.heading',
      fontSize: 1,
    },
    h6: {
      variant: 'type.heading',
      fontSize: 0,
    },
    navitem: {
      color: 'inherit',
      textDecoration: 'none',
      fontWeight: 'bold',
      ':hover,:focus': {
        color: 'primary',
      }
    }
  }
}
