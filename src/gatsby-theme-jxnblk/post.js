/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import Avatar from '../avatar'

export default ({
  title,
  date,
  children,
}) =>
  <div
    sx={{
      maxWidth: 'container',
      px: 3,
      mx: 'auto',
    }}>
    <Styled.h1>{title}</Styled.h1>
    <div sx={{ variant: 'type.small' }}>{date}</div>
    <article>
      {children}
    </article>
  </div>
