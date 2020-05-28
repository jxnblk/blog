/** @jsx jsx */
import { jsx, Styled, useColorMode } from 'theme-ui'
import React from 'react'
import { Helmet } from 'react-helmet'
import get from 'lodash.get'
import { Link } from 'gatsby'
import {
  FaTwitter as Twitter,
  FaGithub as GitHub
} from 'react-icons/fa'
import { Avatar } from 'jxnblk'

const modes = [
  'light',
  'black',
  'dark',
  'deep',
  'hack',
  'pink',
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

const Draft = () => (
  <div
    sx={{
      p: 3,
      my: 4,
      fontWeight: 'bold',
      color: 'background',
      bg: 'accent',
    }}>
    ⚠️ You are viewing an draft post, and this may not be ready for primetime.
  </div>
)

const Layout = props => {
  const [mode, setMode] = useColorMode()
  const cycleMode = e => {
    const i = modes.indexOf(mode)
    const n = (i + 1) % modes.length
    setMode(modes[n])
  }
  const title = props.pageContext?.frontmatter?.title
  let date = props.pageContext?.frontmatter?.date
  if (date) date = new Date(date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
  })
  const draft = props.pageContext?.frontmatter?.draft

  return (
    <div
      sx={{
        variant: 'styles.root',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <header
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          maxWidth: 'wide',
          mx: 'auto',
          px: 3,
          py: 4,
        }}>
        <Styled.a
          as={Link}
          to='/'
          sx={{
            variant: 'styles.navitem',
            fontSize: 0,
            mr: 3,
          }}>
          <Avatar
            size={32}
            sx={{ mr: 2 }}
          />
          Jxnblk
        </Styled.a>
        <Styled.a
          as={Link}
          to='/blog'
          sx={{
            variant: 'styles.navitem',
            fontSize: 0,
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
      <main
        sx={{
          width: '100%',
          maxWidth: 'wide',
          px: 3,
          mx: 'auto',
          flex: '1 1 auto',
        }}>
        <div
          sx={{
            maxWidth: !!title ? 'container' : null,
          }}>
          {draft && <Draft />}
          {title && (
            <Styled.h1>
              {title}
            </Styled.h1>
          )}
          {date && (
            <div
              sx={{
                variant: 'text.small',
                fontWeight: 'bold',
              }}>
              {date}
            </div>
          )}
          {props.children}
        </div>
      </main>
      <footer
        sx={{
          px: 3,
          py: 5,
          width: '100%',
          maxWidth: 'wide',
          mx: 'auto',
        }}>
        <div
          sx={{
            py: 4,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Link to='/avatar' title='About the avatar'>
            <Avatar size={40} />
          </Link>
          <a
            href='https://twitter.com/jxnblk'
            title='Twitter'
            sx={{
              variant: 'styles.navitem',
              ml: 2,
              mr: 3,
            }}>
            <Twitter size={24} />
          </a>
          <a
            href='https://github.com/jxnblk'
            title='GitHub'
            sx={{
              variant: 'styles.navitem',
            }}>
            <GitHub size={24} />
          </a>
        </div>
        <div
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            fontSize: 0,
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
          <Styled.a
            as={Link}
            to='/about'
            sx={{
              variant: 'styles.navitem',
              mr: 4,
            }}>
            About
          </Styled.a>
          <div sx={{ mx: 'auto' }} />
          <div sx={{ my: 2 }}>© 2020 Brent Jackson</div>
        </div>
      </footer>
    </div>
  )
}

const Page = props => {
  let title = 'Jxnblk'
  const postTitle = get(props.data, 'post.title',
    get(props, 'pageContext.frontmatter.title')
  )
  const description = get(props.data, 'post.excerpt',
    get(props, 'pageContext.frontmatter.excerpt')
  ) || 'The writing of Brent Jackson'

  if (postTitle) {
    title = `${postTitle} | ${title}`
  }

  return (
    <React.Fragment>
      <Helmet
        htmlAttributes={{
          lang: 'en-us',
        }}>
          <link
            rel='icon'
            type='image/png'
            href='https://jxnblk.com/favicon.png'
          />
          <link
            rel='apple-touch-icon-precomposed'
            href='https://jxnblk.com/avatar.png'
          />
          <link
            rel='canonical'
            href={props.location.href}
          />
          <meta name='twitter:site' content='@jxnblk' />
          <meta name='og:image' content='https://jxnblk.com/avatar.png' />
          <title>{title}</title>
          <meta name='og:title' content={title} />
          <meta name='og:description' content={description} />
          <meta name='twitter:title' content={title} />
          <meta name='twitter:description' content={description} />
          <meta name='twitter:creator' content='Brent Jackson' />
          <meta name='twitter:card' content='summary' />
        </Helmet>
        <Layout {...props}>
          {props.children}
        </Layout>
    </React.Fragment>
  )
}

export const wrapPageElement = ({ element, props }) =>
  <Page {...props}>
    {element}
  </Page>
