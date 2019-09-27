/** @jsx jsx */
import { jsx } from 'theme-ui'

export const Banner = props =>
  <div
    sx={{
      py: [4, 5, 6],
      fontWeight: 'bold',
      h1: {
        fontSize: [5, 6, 7],
      },
      p: {
      },
      ul: {
        listStyle: 'none',
        display: 'flex',
        p: 0,
        m: 0,
      },
      li: {
        mr: 3,
      },
      a: {
        variant: 'styles.navlink',
      }
    }}>
    {props.children}
  </div>

export const Container = ({ wide, ...props }) =>
  <div
    sx={{
      maxWidth: wide ? 'wide' : 'container',
    }}>
    {props.children}
  </div>

export const Tiles = props =>
  <div
    sx={{
      ul: {
        listStyle: 'none',
        p: 0,
        m: 0,
        display: 'grid',
        gridGap: 4,
        gridTemplateColumns: 'repeat(auto-fit, minmax(256px, 1fr))',
      },
      h2: {
        fontSize: 2,
      },
      img: {
        display: 'block',
        width: 128,
        maxWidth: '100%',
        height: 'auto',
        m: 'auto',
      },
      a: {
        variant: 'styles.navlink',
      },
      ...props.sx
    }}>
    {props.children}
  </div>

export const List = props =>
  <div
    sx={{
      ul: {
        p: 0,
        m: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(256px, 1fr))',
        gridGap: 4,
      },
      a: {
        variant: 'styles.navlink',
        fontWeight: 'bold',
      },
      ...props.sx
    }}>
    {props.children}
  </div>
