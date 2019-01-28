import React from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { maxWidth, space } from 'styled-system'

const Style = createGlobalStyle({
  '*': { boxSizing: 'border-box' },
  body: {
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.5,
    margin: 0,
  }
})

const theme = {
}

const Container = styled.div({
  maxWidth: '768px',
}, space)

export default props =>
  <ThemeProvider theme={theme}>
    <>
      <Style />
      <Container
        mx='auto'
        px={3}
        py={4}>
        {props.children}
      </Container>
    </>
  </ThemeProvider>
