/** @jsx jsx */
import { jsx } from 'theme-ui'

export default ({
  title,
  date,
  children,
}) =>
  console.log(children) ||
  <div>
    {title}
    {children}
  </div>
