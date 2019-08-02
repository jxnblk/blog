/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import Avatar from '../avatar'

const Draft = ({ draft }) => !!draft && (
  <div
    sx={{
      p: 3,
      my: 4,
      fontWeight: 'bold',
      color: 'background',
      bg: 'accent',
    }}>
    ⚠️ You are viewing an draft post and this may not be ready for primetime.
  </div>
)

export default ({
  title,
  date,
  draft,
  children,
}) =>
  <div
    sx={{
      maxWidth: 'container',
    }}>
    <Styled.h1>{title}</Styled.h1>
    <div sx={{ variant: 'type.small' }}>{date}</div>
      {false && <Draft draft={draft} /> }
    <article>
      {children}
    </article>
  </div>
