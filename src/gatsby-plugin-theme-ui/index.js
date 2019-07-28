import prism from '@theme-ui/prism/presets/theme-ui'

export default {
  initialColorMode: 'light',
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#22f',
    secondary: '#60f',
    accent: '#63e',
    muted: '#f9f9fc',
    modes: {
      black: {
        text: '#fff',
        background: '#000',
        primary: '#0ff',
        secondary: '#0fc',
        accent: '#f0f',
        muted: '#111',
      },
      dark: {
        text: '#fff',
        background: '#222224',
        primary: '#2ef',
        secondary: '#fc0',
        accent: '#f0c',
        muted: '#111116',
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
    navitem: {
      display: 'inline-flex',
      alignItems: 'center',
      color: 'inherit',
      textDecoration: 'none',
      fontWeight: 'bold',
      ':hover,:focus': {
        color: 'primary',
      }
    }
  }
}
