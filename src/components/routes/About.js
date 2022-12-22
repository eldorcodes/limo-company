import React from 'react'
import { Container } from 'react-bootstrap'
import Logo from '../img/logo.png';

export default function About() {
  return (
    <Container>
      <h1>About</h1>
      <p>Golden Rides is a limo company located in San Francisco, California.</p>
      <img src={Logo} />
    </Container>

  )
}
