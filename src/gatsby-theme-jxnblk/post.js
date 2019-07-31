/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import Avatar from '../avatar'
import Tweet from '../tweet'

export default ({
  title,
  date,
  children,
  location,
  ...props,
}) =>
  <div
    sx={{
      maxWidth: 'container',
    }}>
    <Styled.h1>{title}</Styled.h1>
    <div
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <div sx={{ variant: 'type.small', mr: 3, }}>{date}</div>
      <Tweet
        text={title}
        url={location.href}
      />
    </div>
    <article>
      {children}
    </article>
    <div>
      <Tweet
        text={title}
        url={location.href}
      />
    </div>
    <div
      sx={{
        py: 5,
        fontWeight: 'bold',
      }}>
      <Styled.a href='https://twitter.com/jxnblk'>
        Follow me on Twitter
      </Styled.a>
      {' '}
      for more great content like this.
    </div>
  </div>
