import React from 'react'
import { Row, Col, Button, Container, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Lottie from 'react-lottie';
import * as animationData from './loading.json';
import { getDatabase, push, ref } from 'firebase/database';

export default function Signup() {
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [SuccessMessage,setSuccessMessage] = useState('');
  
  const [loading,setLoading] = useState(false);

  let auth = getAuth();

const registerUser = (event) =>{
  setLoading(true)
  event.preventDefault()
  createUserWithEmailAndPassword(auth,email,password)
  .then(() => {
   updateProfile(getAuth().currentUser,{
    displayName:username
   })
   .then(() => {
    setSuccessMessage('account-has-been-created')
    setErrorMessage('')
    setUsername('')
    setEmail('')
    setPassword('')
    setLoading(false)
    push(ref(getDatabase(),`users`),{ username,email,date:new Date().toString() })
   })
   .catch(e => {
    setErrorMessage(e.message)
    setSuccessMessage('')
    setLoading(false)
   })
  }).catch(e => {
    setErrorMessage(e.message)
    setSuccessMessage('')
    setLoading(false)
  })

  // clear form data after registration
  setUsername('')
  setEmail('')
  setPassword('')
}
const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

  return <>
  {loading ? <Lottie options={defaultOptions}
              height={400}
              width={400}
              isStopped={false}
              isPaused={false}/>
              :
    <Container>
    
    
    <Row>
      <Col></Col>
      <Col md={5}>
      <h1 className='center'>Register</h1>
      <h2 style={{color:'green'}}>{SuccessMessage}</h2>
      <h2 className='red'>{errorMessage.substring(22,errorMessage.indexOf(')'))}</h2>

      <Form onSubmit={registerUser}>
      <FormGroup className='mb-3'>
        
        <FormControl 
        onChange={(event) => setUsername(event.target.value)} 
        type="text" 
        placeholder='username'
        value={username}
        required
        />
      </FormGroup>
      <FormGroup className='mb-3'>
        
        <FormControl 
        onChange={(event) =>setEmail(event.target.value)} 
        type='email' 
        placeholder='email'
        value={email}
        required
        />
      </FormGroup>
      <FormGroup className='mb-3'>
        
        <FormControl 
        onChange={(event) => setPassword(event.target.value)} 
        type='password' 
        placeholder='password' 
        value={password}
        required
        />
      </FormGroup>
      <FormGroup className="d-grid gap-2 mb-3">
        <Button type='submit' size='lg' variant='warning'>Sign Up</Button>
      </FormGroup>
      <p className='center'><Link to={'/login'}>
      Need to login?
      </Link></p>
      
    </Form>
      </Col>
      <Col></Col>
    </Row>
  </Container>
  }
  </>
}

