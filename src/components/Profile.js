import React from 'react'
import { Container, Button } from 'react-bootstrap'
import {getAuth, signOut} from 'firebase/auth';
import Lottie from 'react-lottie';
import * as animationData from './loading.json';
import { useState } from 'react'


export default function Profile() {
const [loading,setLoading] = useState(false);
const [errorMessage,setErrorMessage] = useState('');


  let auth = getAuth()

  function logUserOut(){
    setLoading(true)
    setTimeout(() => {
      
    signOut(auth)
    .then(() => {
      setLoading(false)
    }).catch((e) => {
      setLoading(false)
      setErrorMessage(e.message)
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
      {loading ? 
                <Lottie options={defaultOptions}
                  height={400}
                  width={400}
                  isStopped={false}
                  isPaused={false}/>
              :
                <Container>
                  <h1>Profile</h1>
                  <h2 className='red'>{errorMessage}</h2>
                </Container>}
  </>
  )
}
