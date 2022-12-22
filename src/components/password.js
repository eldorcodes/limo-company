import React, { useState } from 'react';
import './firebase';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { Form, Button, Container, FormControl, Row, Col, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as animationData from './loading.json';
import Lottie from 'react-lottie';

export default function Password() {
    const [email, setEmail] = useState('');
    const [message,setMessage] = useState('');

    const [errorMessage,setErrorMessage] = React.useState('');
    const [SuccessMessage,setSuccessMessage] = React.useState('');
    const [loading,setLoading] = useState(false);


    let auth = getAuth()

    function sendEmail(event){
        setLoading(true)
        setTimeout(() => {
            event.preventDefault()
        sendPasswordResetEmail(auth,email)
        .then(() => {
            setSuccessMessage('Password reset instructions have been emailed.')
            setErrorMessage('')
            setLoading(false)
        }).catch((e) => {
            setErrorMessage(e.message)
            setSuccessMessage('')
            setLoading(false)

        })
        },2000)
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
            loading ? <Lottie options={defaultOptions}
            height={400}
            width={400}
            isStopped={false}
            isPaused={false}/>
            :
            <Container>
            
            <Row>
                <Col></Col>
                <Col md={5}>
                <h3>Enter your email</h3>
                <h3 classname='center' style={{color:'green'}}>{SuccessMessage}</h3>
                <h3 className='red center'>{errorMessage.substring(22,errorMessage.indexOf(')'))}</h3>
                <Form onSubmit={sendEmail}>
                    <FormGroup className='mb-3'>
                        <FormControl 
                        placeholder='Enter your email'
                        value={email} 
                        onChange={(event) => setEmail(event.target.value)} />
                    </FormGroup>
                    <FormGroup className='mb-3 d-grid gap-2'>
                        <Button type='submit' size='lg' variant='warning'>Reset password</Button>
                    </FormGroup>
                    <Link to={'/login'}>Need to login?</Link>
            </Form>
                </Col>
                <Col></Col>

            </Row>
        </Container>
        }
        </>
  )
}
