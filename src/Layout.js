import React from 'react'
import {
  Container,
  Box,
  Heading,
  Flex,
  Link
} from 'rebass'

export default props => {
  console.log(props)
  return (
  <Container maxWidth={768} py={5}>
    <Box
      is='header'
      mb={5}>
      <Heading is='h1'>
        Jxnblk Writing
      </Heading>
    </Box>
    <main>
      {props.children}
    </main>
    <Flex
      is='footer'
      py={5}>
      <Link href='http://jxnblk.com'>Jxnblk</Link>

    </Flex>
  </Container>
)
}
