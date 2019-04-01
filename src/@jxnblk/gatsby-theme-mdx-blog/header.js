import React from 'react'
import { Link } from 'gatsby'
import { useComponents } from 'emotion-mdx'
import {
  useTheme,
  Button,
  Box,
  Container,
} from '@jxnblk/gatsby-theme-mdx-blog'

const modes = [
  'light',
  'dark',
]

export default props => {
  const Styled = useComponents()
  const { mode, setMode } = useTheme()
  if (!mode) setMode('light')

  const cycleMode = () => {
    const i = (modes.indexOf(mode) + 1) % modes.length
    setMode(modes[i])
  }

  return (
    <Box as='header' block='header'>
      <Container
        css={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <Styled.h3
          fontSize={6}
          my={0}>
          <Link
            to='/'
            css={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Jxnblog
          </Link>
        </Styled.h3>
        <Box mx='auto' />
        <Button title='Change Color Mode' onClick={cycleMode}>
          {mode}
        </Button>
      </Container>
    </Box>
  )
}

