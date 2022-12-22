import React,{ useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import moment from 'moment';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import * as animationData from '../payment-successful.json'
import emailjs from '@emailjs/browser';

const CheckoutForm = () => {
  const form = useRef();

  const stripe = useStripe();
  const elements = useElements();
  const [reservation,setReservation] = useState(null);
  const [errorMessage,setErrorMessage] = useState(null);
  const [successMessage,setSuccessMessage] = useState(null);
  const [processing,setProcessing] = useState(false);

  const [isReservationComplete, setIsReservationComplete] = useState(false);

  let navigate = useNavigate()

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
//// send email with emailjs
const sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm('service_m3givjb', 'template_bcydh3j', 
  form.current, 'O1G4OpkAXHj5Yp9S-')
    .then((result) => {
        console.log(result.text);

    }, (error) => {
        console.log(error.text);
    });
};


  useEffect(() => {
    onValue(ref(getDatabase(),`reservation`),(reservations) => {
      reservations.forEach((res) => {
        if (res.val().uid === getAuth().currentUser.uid) {
          setReservation(res)
          console.log(res.val());
        }
      })
    })
  },[])
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }
setProcessing(true)
  const response = await fetch(`http://localhost:4000/charge-client`,{
      headers:{
        'content-type':'application/json'
      },
      method:'POST',
      body:JSON.stringify({
        amount:calculateTotalWithTax(reservation.val().price),
        reservation,
        date:new Date().toString(),
        email:reservation.val().email,
        loggedUserEmail:getAuth().currentUser?.email,
        confirmation:reservation.key,
        from:reservation.val().pickupAddress,
        to:reservation.val().dropOffAddress,
        date:reservation.val().date
      })
    })

    let { clientSecret, error, id } = await response.json()
    if (error) {
      setErrorMessage(error)
      setProcessing(false)
    }
     // confirm card payment
     const payload = await stripe.confirmCardPayment(clientSecret,{
      payment_method:{
        card:elements.getElement(CardElement)
      }
    })
   
    if (payload.error) {
      setErrorMessage(`Payment failed. ${payload.error.message}`)
      setProcessing(false)
    }else{
      setSuccessMessage(`Payment succeeded`)
      setIsReservationComplete(true)
      setErrorMessage(null)
      setProcessing(false)
      /// update reservation
      update(ref(getDatabase(),`reservation/${reservation.key}`),{
        totalWithTax:calculateTotalWithTax(reservation.val().price),
        tax:'10%',
        paymentID:id
      })
      // navigate('/trips')
      // email receipt
      fetch('http://localhost:4000/sendEmail', {
          type: 'POST',
          data: JSON.stringify({
            currentUserEmail:getAuth().currentUser.email,
            reservation
        }),
          contentType: 'application/json'
      }).done(function() {
          alert('Your mail is sent!');
      }).fail(function(error) {
          alert('Oops... ' + JSON.stringify(error));
      });
    }
   
  };

  const inputStyle = {
    iconColor: '#c4f0ff',
    color: 'blue',
    fontWeight: '500',
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    ':-webkit-autofill': {
      color: 'blue',
    },
    '::placeholder': {
      color: 'gray',
    }
}

function calculateTotalWithTax(total){
  console.log('total -- ', total);
  console.log(typeof total);
  let totalNum = parseInt(total);
  console.log('totalNum --- ', totalNum);
  let totalWithTax = ((totalNum / 100) * 10) + totalNum;
  console.log('TOTAL WITH TAX --- ', totalWithTax);
  return totalWithTax.toFixed(2)
}

  return (
   <>
   <div>
   <form id="form">
   <input style={{ display:'none' }}
   id='user-email' 
   type="email" 
   value={getAuth().currentUser.email} 
   name="user_email" />
   </form>
   </div>
  <div>
    <>
  {isReservationComplete ? <Container>
    <br />
    <Alert variant='success'>
    You have successfully made a reservation. Thank you for your business.
    </Alert>
   <div style={{ display:'flex', justifyContent:'space-between' }}>
    <h3>Confirmation Code {reservation.key.slice(0,7)}</h3>
   <Button onClick={() => navigate('/trips')} variant='link'>View reservation</Button>
   </div>
  </Container>
  :
  <>
   {reservation && <Container>
{<div>
<Card className='mb-3'>
      <Card.Body>
        <Card.Text>
        <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
        <div  style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
        <h5>Date: </h5>
        <p  style={{ paddingLeft:10 }}>{moment(reservation?.val().date).format('MMMM Do YYYY, h:mm a')}</p>
        </div>
        <FaEdit />
        </div>


        <div style={{ display:'flex', flexDirection:'row' }}>
  <h5>Phone number:</h5> 
<p style={{ paddingLeft:10 }}> 
  {reservation?.val().phone}</p>
  </div>

  <div style={{ display:'flex', flexDirection:'row' }}>
  <h5>Email Address:</h5> 
<p style={{ paddingLeft:10 }}> 
  {reservation?.val().email}</p>
  </div>


<div style={{ display:'flex', flexDirection:'row' }}>
  <h5>Number of passengers:</h5> 
<p style={{ paddingLeft:10 }}> 
  {reservation.val().numOfPassengers}</p>
  </div>

  <div style={{ display:'flex', flexDirection:'row' }}>
  <h5>Number of luggages:</h5> 
<p style={{ paddingLeft:10 }}> 
  {reservation.val().numOfLuggages}</p>
  </div>

  { <div style={{ display:'flex', flexDirection:'row' }}>
  <h5>Number of Child seats:</h5> 
<p style={{ paddingLeft:10 }}> 
  {reservation.val().childSeatNumber}</p>
  </div>}
  
  <div style={{ display:'flex', flexDirection:'row' }}>
  <h5>Pick Up Address:</h5>
<p  style={{ paddingLeft:10 }}> {reservation.val().pickupAddress}</p>
  </div>

<div  style={{ display:'flex', flexDirection:'row' }}>
<h5> Stops:</h5>
{reservation.val().numOfStop?.map((stop,index) => {
    if (stop) {
      return (
        <p key={index} style={{ paddingLeft:10 }}>{stop.stop}</p>
      )
    }
  })}

  {!reservation.val().numOfStop && <p style={{ paddingLeft:10 }}>0</p> }
</div>
 
 <div style={{ display:'flex', flexDirection:'row' }}>
 <h5>Drop Off Address:</h5> 
<p  style={{ paddingLeft:10 }}>{reservation.val().dropOffAddress}</p>
 </div>
 <div style={{ display:'flex', flexDirection:'row' }}>
 <h5>Vehicle details:</h5> 
<p style={{ paddingLeft:10 }}>
  {reservation.val().vehicleDetails.make} 
{' '}
{reservation.val().vehicleDetails.model} 
{' '}
{reservation.val().vehicleDetails.year}
{', '}
{reservation.val().vehicleDetails.color.toUpperCase()}
{' '}
</p>
 </div>
        </Card.Text>
      </Card.Body>
    </Card>

    {processing &&  <Lottie options={defaultOptions}
              height={400}
              width={400}
              isStopped={false}
              isPaused={false}/>}

     <Card style={{ padding:20 }}>
      <h3 style={{ textAlign:'center' }}>Make a reservation</h3>
      <p style={{ textAlign:'center',color:'red' }}>{errorMessage}</p>
      <p style={{ textAlign:'center',color:'green' }}>{successMessage}</p>
     <form onSubmit={handleSubmit}>
      <CardElement  
      options={{
        style: {
          base: inputStyle,
        },
      }} />
     <div className='d-grid gap-2'>
      <br/>
      <p style={{ color:'green', textAlign:'end' }}>Subtotal: ${reservation.val().price}</p>
      <p style={{ color:'green', textAlign:'end' }}>Tax: 10%</p>
      <p style={{ color:'green', textAlign:'end' }}>Total with tax: ${calculateTotalWithTax(reservation.val().price)}</p>
      <br/>
     <Button type="submit" disabled={!stripe || !elements}>
        Pay
      </Button>
     </div>
    </form>
     </Card>
</div>}
   </Container>}
  </> }
    </>
  </div>
   </>
  );
};

const stripePromise = loadStripe('pk_test_51MB31jDItceLCEYbLWfk7lz9B7PBDWqqavUcDuRCJxQZYHoXUbEFQWetvYOARFaDVSgHm244OgRSD2NV46IqskjX00ISyg3L2e');

const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm  />
  </Elements>
);

export default Payment