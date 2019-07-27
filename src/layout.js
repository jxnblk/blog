/** @jsx jsx */
import { jsx, Styled, useColorMode } from 'theme-ui'
import { Link } from 'gatsby'
import { Global } from '@emotion/core'
import Avatar from './avatar'

const modes = [
  'light',
  'black',
  'dark',
]

const ColorButton = ({
  mode,
  ...props
}) =>
  <button
    {...props}
    title='Cycle Color Mode'
    sx={{
      display: 'inline-block',
      appearance: 'none',
      bg: 'transparent',
      color: 'inherit',
      p: 1,
      m: 0,
      border: 0,
      borderRadius: 9999,
      ':hover,:focus': {
        color: 'primary',
        boxShadow: '0 0 0 3px',
        outline: 'none',
      }
    }}>
    <svg
      viewBox='0 0 32 32'
      width='24'
      height='24'
      fill='currentcolor'
      sx={{
        display: 'block',
      }}>
      <circle
        cx='16'
        cy='16'
        r='14'
        fill='none'
        stroke='currentcolor'
        strokeWidth='4'
      />
      <path
        d={`
          M 16 0
          A 16 16 0 0 0 16 32
          z
        `}
      />
    </svg>
  </button>

export default props => {
  const [mode, setMode] = useColorMode()
  const cycleMode = e => {
    const i = modes.indexOf(mode)
    const n = (i + 1) % modes.length
    setMode(modes[n])
  }

  return (
    <div
      sx={{
        variant: 'styles.root',
      }}>
      <Global
        styles={{
          body: {
            margin: 0,
          }
        }}
      />
      <header
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 4,
        }}>
        <Styled.a
          as={Link}
          to='/'
          sx={{
            variant: 'styles.navitem',
            mr: 3,
          }}>
          Jxnblk
        </Styled.a>
        <Styled.a
          as={Link}
          to='/blog'
          sx={{
            variant: 'styles.navitem',
            mr: 3,
          }}>
          Blog
        </Styled.a>
        <div sx={{ mx: 'auto' }} />
        <ColorButton
          mode={mode}
          onClick={cycleMode}
        />
      </header>
      <main>
        {props.children}
      </main>
      <footer
        sx={{
          px: 3,
          py: 4,
        }}>
        <div
          sx={{
            py: 4,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Avatar />
        </div>
        <div
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 0,
          }}>
          <Styled.a
            href='https://twitter.com/jxnblk'
            sx={{
              variant: 'styles.navitem',
              mr: 2,
            }}>
            Twitter
          </Styled.a>
          <Styled.a
            href='https://github.com/jxnblk'
            sx={{
              variant: 'styles.navitem',
              mr: 2,
            }}>
            GitHub
          </Styled.a>
          <div sx={{ mx: 'auto' }} />
          <div>© 2019 Brent Jackson</div>
        </div>
      </footer>
    </div>
  )
}
