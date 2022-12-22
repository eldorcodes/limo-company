import React from 'react';
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import './firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Lottie from 'react-lottie';
import * as animationData from './loading.json';


export default function Login() {
    const [email,setEmail] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [errorMessage,setErrorMessage] = React.useState('');
    const [SuccessMessage,setSuccessMessage] = React.useState('');
    const [loading,setLoading] = React.useState(false);
   

    let auth = getAuth()

    function loginUser(event){
        setLoading(true)
        setTimeout(() => {
            event.preventDefault()
        signInWithEmailAndPassword(auth,email,password)
        .then(() => {
            setSuccessMessage('Login was successful.')
            setErrorMessage('')
            setLoading(false)
        }).catch((e) => {
            setErrorMessage(e.message)
            setSuccessMessage('')
            setLoading(false)
        })
        }, 2000)
    }

    function logUserIn(){
        console.log(email,password)

        // clear form data after login success
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


  return (
    <>
    {
        loading ? <Lottie
        options={defaultOptions}
        height={400}
        width={400}
        isStopped={false}
        isPaused={false}/>
  
        :
        <Container>
    <Row>
        <Col>
        </Col>
        <Col md={5}>
        <h1 className='center'>Login</h1>
    <h2 classname='center' style={{color:'green'}}>{SuccessMessage}</h2>
    <h2 className='red center'>{errorMessage.substring(22,errorMessage.indexOf(')'))}</h2>
    <Form onSubmit={loginUser}>
        <FormGroup className='mb-3'>
            
            <FormControl 
            onChange={(event) => setEmail(event.target.value)}
            type='email' 
            placeholder='Email'
            value={email}
            required 
            />
        </FormGroup>
        <FormGroup className='mb-3'>
            
            <FormControl 
            onChange={(event) => setPassword(event.target.value)}
            type='password' 
            placeholder='Password'
            value={password}
            required 
            />
        </FormGroup>
        <FormGroup className="d-grid gap-2 mb-3">
            <Button 
            
            type='submit' size='lg' variant='warning'>Log In</Button>
        </FormGroup>
        <p className='center'><Link to={'/signup'}>
            Need an account?
        </Link></p>
        <p className='center'><Link to={'/password'}>Forgot password?</Link></p>  
    </Form>
        </Col>
        <Col>
        </Col>
    </Row>
  </Container>
    }
    </>
  )
}
