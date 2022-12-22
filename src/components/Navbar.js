import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from './img/logo.png';
import { FaUserCircle } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Header() {
  let navigate = useNavigate()
  return (
    <Navbar collapseOnSelect expand="md" bg="black" variant="dark">
      <Container>
        <Navbar.Brand href="/">
            <img 
            src = {Logo}
            width = "188"
            
            className = "d-inline-block align-top"
            alt = "Golden Rides logo"
            />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/"><p className='white'>Home</p></Nav.Link>
            <Nav.Link href="/about"><p className='white'>About</p></Nav.Link>
            <Nav.Link href="/reservation"><p className='white'>Reservation</p></Nav.Link>
            <Nav.Link href="/trips"><p className='white'>My Trips</p></Nav.Link>
            <Nav.Link href="/services"><p className='white'>Services</p></Nav.Link>
            <NavDropdown title="Rates" id="collasible-nav-dropdown" active style={{fontSize:18, fontWeight:'bold', color:'white'}}>
              <NavDropdown.Item href="/napavalley">Napa Valley</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/sflimo">
                SFO Limo & Car Service
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/oaklimo">OAK Limo & Car Service</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/sjclimo">
                SJC Limo & Car Service
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>

            {getAuth().currentUser ? <Nav.Link>
              
             <Button variant='link' onClick={() => signOut(getAuth()) }>
             <p className='white'>Log Out</p>
             </Button>
             </Nav.Link>
              :
              <Nav.Link><p className='white'>
                 <Button variant='link' onClick={() => navigate("/login") }>
             <p className='white'>Log In</p>
             </Button>
              </p></Nav.Link>
              }

            <Nav.Link eventKey={2} href="/signup">
              <FaUserCircle fontSize={34} color={'#fff'} />
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;