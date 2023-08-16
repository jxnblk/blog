/** @jsx jsx */
import { jsx } from 'theme-ui'
import qs from 'querystring'

export default ({
  text,
  url,
  via = 'jxnblk',
}) => {
  const search = qs.stringify({
    text,
    url,
    via,
  })
  const href = `https://twitter.com/intent/tweet?${search}`

  return (
    <a
      className="twitter-share-button"
      sx={{
        width: 55,
        height: 20,
      }}
      href={href}>
      Tweet
    </a>
  )
}
