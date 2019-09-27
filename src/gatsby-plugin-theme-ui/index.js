import prism from '@theme-ui/prism/presets/theme-ui'

export default {
  initialColorMode: 'light',
  colors: {
    text: '#000',
    background: '#fff',
    primary: 'hsl(240, 100%, 57%)',
    secondary: 'hsl(260, 100%, 57%)',
    accent: 'hsl(280, 100%, 57%)',
    muted: '#f9f9fc',
    gray: '#555',
    modes: {
      black: {
        text: '#fff',
        background: '#000',
        primary: '#0ff',
        secondary: '#0fc',
        accent: '#f0f',
        muted: '#111',
        gray: '#888',
      },
      dark: {
        text: '#fff',
        background: 'hsl(180, 5%, 15%)',
        primary: 'hsl(180, 100%, 57%)',
        secondary: 'hsl(50, 100%, 57%)',
        accent: 'hsl(310, 100%, 57%)',
        muted: 'hsl(180, 5%, 5%)',
        gray: 'hsl(180, 0%, 70%)',
      },
      deep: {
        text: '#fff',
        background: 'hsl(230,25%,18%)',
        primary: 'hsl(260, 100%, 80%)',
        secondary: 'hsl(290, 100%, 80%)',
        highlight: 'hsl(260, 20%, 40%)',
        accent: 'hsl(290, 100%, 80%)',
        muted: 'hsla(230, 20%, 0%, 20%)',
        gray: 'hsl(210, 50%, 60%)',
      },
      hack: {
        text: 'hsl(120, 100%, 75%)',
        background: 'hsl(120, 20%, 10%)',
        primary: 'hsl(120, 100%, 40%)',
        secondary: 'hsl(120, 50%, 40%)',
        accent: 'hsl(120, 100%, 90%)',
        muted: 'hsl(120, 20%, 7%)',
        gray: 'hsl(120, 20%, 40%)',
      },
      pink: {
        text: 'hsl(350, 80%, 10%)',
        background: 'hsl(350, 100%, 90%)',
        primary: 'hsl(350, 100%, 50%)',
        secondary: 'hsl(280, 100%, 50%)',
        accent: 'hsl(280, 100%, 20%)',
        muted: 'hsl(350, 100%, 88%)',
        gray: 'hsl(350, 40%, 50%)',
      }
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
    14, 16, 18, 20, 24, 32, 48, 64, 72, 96
  ],
  sizes: {
    container: 768,
    wide: 1280,
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
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
    },
  },
  prism,
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontSize: 2,
    },
    a: {
      color: 'primary',
      ':hover,:focus': {
        color: 'secondary',
      }
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
    img: {
      maxWidth: '100%',
      height: 'auto',
    },
    pre: {
      fontFamily: 'monospace',
      fontSize: 1,
      bg: 'muted',
      p: 3,
      borderRadius: 8,
      overflowX: 'auto',
      variant: 'prism',
    },
    code: {
      fontFamily: 'monospace',
      color: 'secondary',
    },
    inlineCode: {
      fontFamily: 'monospace',
      color: 'secondary',
    },
    hr: {
      border: 0,
      my: 4,
      borderBottom: '1px solid',
      borderColor: 'muted',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    th: {
      textAlign: 'left',
      py: 2,
      borderBottomStyle: 'solid',
    },
    td: {
      textAlign: 'left',
      py: 2,
      borderBottom: '1px solid',
      borderColor: 'muted',
    },
    blockquote: {
      fontWeight: 'bold',
      fontSize: 3,
      mx: 0,
      px: 3,
      my: 5,
      borderLeft: '4px solid',
    },
    navlink: {
      color: 'inherit',
      textDecoration: 'none',
      ':hover,:focus': {
        color: 'primary',
      }
    },
    navitem: {
      variant: 'styles.navlink',
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: 'bold',
    }
  }
}
