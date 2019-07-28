/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Avatar } from 'jxnblk'

export default ({
  size = 64,
  ...props
}) =>
  <div
    {...props}
    sx={{
      width: size,
      height: size,
      borderRadius: 9999,
      bg: 'white',
    }}>
    <Avatar
      size={size}
    />
  </div>
