import React, { useState, useEffect } from 'react';
import { Button, Carousel, Col, Container, Row, Card, Alert } from 'react-bootstrap';
import Lincoln from '../img/2_08.png';
import Lincoln2 from '../img/lincoln1.jpg';
import Lincoln3 from '../img/lincoln2.webp';

import { FaEdit, FaSuitcase, FaUsers } from 'react-icons/fa';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import '../firebase';
import XTS from '../img/XTS.jpg';
import XTS2 from '../img/XTS2.jpg';
import XTS3 from '../img/XTS3.webp';
import Suburban2 from '../img/sub1.jpg';
import Suburban3 from '../img/sub2.webp';
import Suburban from '../img/1_06.png';

import LincolnCorsair1 from '../img/Lincoln_Corsair_interior.jpg';
import LincolnCorsair2 from '../img/lincolncorsairinterior.png';
import LincolnCorsair3 from '../img/Lincoln-Corsair.webp';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';




export default function SelectVehicle() {
  const navigate = useNavigate();

  const [reservation,setReservation] = useState(null);
  const [vehicles,setVehicles] = useState([
    {
      make:'Lincoln',
      model:'Navigator',
      year:2021,
      color:'black',
      luggage:5,
      passengers:7,
      images:[Lincoln,Lincoln2,Lincoln3],
      pricePerMile:6,
      pricePerHour:100,
      type:'SUV'
    },
    {
      make:'Cadillac',
      model:'XTS',
      year:2022,
      color:'black',
      luggage:2,
      passengers:3,
      images:[XTS, XTS2, XTS3],
      pricePerMile:5,
      pricePerHour:80,
      type:'Sedan'
    },
    {
      make:'Chevrolet',
      model:'Suburban',
      year:2022,
      color:'black',
      luggage:5,
      passengers:6,
      images:[Suburban,Suburban2,Suburban3],
      pricePerMile:6,
      pricePerHour:100,
      type:'SUV'
    },
    {
      make:'Lincoln',
      model:'Corsair',
      year:2022,
      color:'black',
      luggage:3,
      passengers:4,
      images:[LincolnCorsair3,LincolnCorsair1,LincolnCorsair2],
      pricePerMile:5,
      pricePerHour:80,
      type:'VAN'
    }
  ])

 

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



  function updateReservation(totalPrice,vehicleDetails){
    console.log(totalPrice);
    update(ref(getDatabase(),`reservation/${reservation.key}`),{
      price:totalPrice,
      vehicleDetails
    })
    navigate('/payment')
  }
  



  return (
   <>
   {reservation &&  <Container>
      <div className='space-top'></div>
      <Row>
        <Col md={12}>

        <Card className='mb-3'>
      <Card.Body>
        <Card.Text>
        <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
        <div  style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
        <h5>Date: </h5>
        <p  style={{ paddingLeft:10 }}>{moment(reservation.val().date).format('MMMM Do YYYY, h:mm a')}</p>
        </div>
        <FaEdit />
        </div>


        <div style={{ display:'flex', flexDirection:'row' }}>
  <h5>Phone number:</h5> 
<p style={{ paddingLeft:10 }}> 
  {reservation.val().phone}</p>
  </div>

  <div style={{ display:'flex', flexDirection:'row' }}>
  <h5>Email Address:</h5> 
<p style={{ paddingLeft:10 }}> 
  {reservation.val().email}</p>
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
        </Card.Text>
      </Card.Body>
    </Card>

         
        </Col>

        <div style={{ display:'flex',justifyContent:'center' }}>
        <Alert style={{ width:'100%'}} variant='secondary'>
        <h1 style={{ textAlign:'center', marginBottom:20 }}>Choose vehicle</h1>
        </Alert>
        </div>
       
       {vehicles.map((vehicle,index) => {
        if (reservation.val().numOfPassengers <= 3 || reservation.val().numOfLuggages <= 2) {
            return (
              <Col key={index} md={6}>
               <Card  className='mb-3'>
                <Card.Body>
                <div className='vehicle-container'>
               <h4 className='center'>{vehicle.make}</h4>
               <h5 className='center'>{vehicle.model}</h5>
              <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[0]}
                alt="First slide"
              />
          
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[1]}
                alt="Second slide"
              />
      
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[2]}
                alt="Third slide"
              />
      
           
            </Carousel.Item>
          </Carousel>
             <div className='luggage-passengers'>
             <p><FaSuitcase />: {vehicle.luggage}</p>
          <p><FaUsers/>: {vehicle.passengers}</p>
             </div>
     
             <p style={{ fontWeight:'bold',fontSize:20,color:'green', textAlign:'center'  }}>
               {reservation.val().hourly ? '$' + (vehicle.pricePerHour * parseFloat(reservation.val().hourly)).toFixed(2) : '$' + (vehicle.pricePerMile * parseFloat(reservation.val().numOfStop ? reservation.val().distance : reservation.val().textDistance)).toFixed(2)}
               </p>
     
             <div className='book-btn-parent'>
                 <button onClick={() =>  {
                  let amountToCarge = reservation.val().hourly ?  (vehicle.pricePerHour * parseFloat(reservation.val().hourly)).toFixed(2) : (vehicle.pricePerMile * parseFloat(reservation.val().numOfStop ? reservation.val().distance : reservation.val().textDistance)).toFixed(2);
                  updateReservation(amountToCarge,vehicle)
                 }} className='book-btn'>Book Now</button>
               </div>
     
               </div>
                </Card.Body>
               </Card>
              </Col>
            )
        }
        else if (reservation.val().numOfPassengers <= 4 && reservation.val().numOfLuggages <= 3 ) {
          if (vehicle.type === 'VAN' || vehicle.type === 'SUV') {
            return (
              <Col key={index} md={5}>
               <Card>
                <Card.Body>
                <div className='vehicle-container'>
               <h4 className='center'>{vehicle.make}</h4>
               <h5 className='center'>{vehicle.model}</h5>
              <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[0]}
                alt="First slide"
              />
          
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[1]}
                alt="Second slide"
              />
      
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[2]}
                alt="Third slide"
              />
      
           
            </Carousel.Item>
          </Carousel>
             <div className='luggage-passengers'>
             <p><FaSuitcase />: {vehicle.luggage}</p>
          <p><FaUsers/>: {vehicle.passengers}</p>
             </div>
     
             <p style={{ fontWeight:'bold',fontSize:20,color:'green', textAlign:'center'  }}>
               {reservation.val().hourly ? '$' + (vehicle.pricePerHour * parseFloat(reservation.val().hourly)).toFixed(2) : '$' + (vehicle.pricePerMile * parseFloat(reservation.val().numOfStop ? reservation.val().distance : reservation.val().textDistance)).toFixed(2)}
               </p>
     
             <div className='book-btn-parent'>
                 <button onClick={() =>  {
                  let amountToCarge = reservation.val().hourly ?  (vehicle.pricePerHour * parseFloat(reservation.val().hourly)).toFixed(2) : (vehicle.pricePerMile * parseFloat(reservation.val().numOfStop ? reservation.val().distance : reservation.val().textDistance)).toFixed(2);
                  updateReservation(amountToCarge,vehicle)
                 }} className='book-btn'>Book Now</button>
               </div>
     
               </div>
                </Card.Body>
               </Card>
              </Col>
            )
          }
        }
        else if (reservation.val().numOfPassengers > 4 || reservation.val().numOfLuggages > 3) {
          if (vehicle.type === 'SUV') {
            return (
              <Col key={index} md={5}>
              <Card>
                <Card.Body>
                <div className='vehicle-container'>
               <h4 className='center'>{vehicle.make}</h4>
               <h5 className='center'>{vehicle.model}</h5>
              <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[0]}
                alt="First slide"
              />
          
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[1]}
                alt="Second slide"
              />
      
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={vehicle.images[2]}
                alt="Third slide"
              />
      
           
            </Carousel.Item>
          </Carousel>
             <div className='luggage-passengers'>
             <p><FaSuitcase />: {vehicle.luggage}</p>
          <p><FaUsers/>: {vehicle.passengers}</p>
             </div>
     
             <p style={{ fontWeight:'bold',fontSize:20,color:'green', textAlign:'center'  }}>
               {reservation.val().hourly ? '$' + (vehicle.pricePerHour * parseFloat(reservation.val().hourly)).toFixed(2) : '$' + (vehicle.pricePerMile * parseFloat(reservation.val().numOfStop ? reservation.val().distance : reservation.val().textDistance)).toFixed(2)}
               </p>
     
             <div className='book-btn-parent'>
                 <button 
                 onClick={() =>  {
                  let amountToCarge = reservation.val().hourly ?  (vehicle.pricePerHour * parseFloat(reservation.val().hourly)).toFixed(2) : (vehicle.pricePerMile * parseFloat(reservation.val().numOfStop ? reservation.val().distance : reservation.val().textDistance)).toFixed(2);
                  updateReservation(amountToCarge,vehicle)
                 }}
                  className='book-btn'>Book Now</button>
               </div>
     
               </div>
                </Card.Body>
              </Card>
              </Col>
            )
          }
        }
       })}

      </Row>
    </Container> }
   </>
  )
}
