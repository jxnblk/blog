/** @jsx jsx */
import { jsx, Styled, useColorMode } from 'theme-ui'
import { Link } from 'gatsby'
import { Button } from '@jxnblk/gatsby-theme-mdx-blog'

const modes = [
  'light',
  'dark',
]

export default props => {
  const [ mode, setMode ] = useColorMode()
  if (!mode) setMode('light')

  const cycleMode = () => {
    const i = (modes.indexOf(mode) + 1) % modes.length
    setMode(modes[i])
  }

  return (
    <header>
      <div
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: 768,
          mx: 'auto',
          px: 3,
          pt: 4,
          pb: 5,
        }}>
        <Styled.h3
          sx={{
            fontSize: 6,
            my: 0,
          }}>
          <Link
            to='/'
            sx={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Jxnblog
          </Link>
        </Styled.h3>
        <div sx={{ mx: 'auto' }} />
        <Button title='Change Color Mode' onClick={cycleMode}>
          {mode}
        </Button>
      </div>
    </header>
  )
}

