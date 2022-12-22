import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Card, Alert, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { BiEdit, BiTrash } from 'react-icons/bi'
import '../firebase';

export default function Trips() {
    const [myTrips,setMyTrips] = useState([]);
    const [tripStatus,setTripStatus] = useState('');
    const [deleteMessage,setDeleteMessage] = useState('')

    function dateCompare(d1, d2){
      const date1 = new Date(d1);
      const date2 = new Date(d2);
  
      if(date1 > date2){
          console.log(`${d1} is greater than ${d2}`)
         setTripStatus('Completed trip')
      } else if(date1 < date2){
          console.log(`${d2} is greater than ${d1}`)
      } else{
          console.log(`Both dates are equal`);
          setTripStatus('Upcoming trip')
      }
  }

  function getTripStatus(d1,d2){
    let statusMessage = null;
    let formattedDate1 = moment(d1).subtract(10, 'days').calendar();
    let formattedDate2 = moment(d2).subtract(10, 'days').calendar();
    if (new Date(formattedDate1) < new Date(formattedDate2)) {
      statusMessage = 'Expired trip'
    } else {
      statusMessage = 'Upcoming trip'
    }
    return statusMessage
  }
  

    useEffect(() => {
        onValue(ref(getDatabase(),`reservation`),(reservations) => {
            let tripArray = []
            reservations.forEach((trip) => {
                if (trip.val().uid === getAuth().currentUser.uid) {
                    tripArray.push(trip)
                }
            })
            setMyTrips(tripArray.reverse())
        })
    },[])

    function deleteReservation(key){
      remove(ref(getDatabase(),`reservation/${key}`))
      setDeleteMessage('Reservation deleted.')
    }

  return <Container>
    <br/>
    {deleteMessage && <Alert variant="danger">
      {deleteMessage}
    </Alert>}
    {<Row>
        {myTrips.map((reservation,index) => (
              <Col key={index} md={12}>
              <Card className='mb-3'>
                <Card.Title>
                   
             <div style={{ display:'flex', 
             flexDirection:'row', 
             justifyContent:'space-between' }}>
              <div>
              {reservation.val().totalWithTax ? <BiEdit size={30} /> : <BiTrash onClick={() => deleteReservation(reservation.key)} color="red" size={30} />}
              </div>
              <div style={{ padding:5 }}>
                {
                  !reservation.val().totalWithTax && <BiEdit size={30} />
                }
                {
                  reservation.val().totalWithTax && getTripStatus(reservation.val().date,new Date().toString()) === 'Upcoming trip' && <Button size='sm' variant="outline-warning">Request cancelation</Button> 
                }
              </div>
             </div>
                </Card.Title>
            <Card.Body>
              <Card.Text>
              <Alert variant={getTripStatus(reservation.val().date,new Date().toString()) === 'Completed trip' ? 'danger':'info'}>
              <h3>
                {myTrips && getTripStatus(reservation.val().date,new Date().toString())}
                </h3>
              </Alert>

              <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
              <div  style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
              <h5>Confirmation code: </h5>
              <p  style={{ paddingLeft:10 }}>{reservation.key.slice(1,7)}</p>
              </div>

              <div>
             
              </div>
              </div>

              <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
              <div  style={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
              <h5>Date: </h5>
              <p  style={{ paddingLeft:10 }}>{moment(reservation.val().date).format('MMMM Do YYYY, h:mm a')}</p>
              </div>

              <div>
             
              </div>
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
      {reservation.val().numOfStop?.map((stop,index) => (
              <p key={index} style={{ paddingLeft:10 }}>{stop.stop}</p>
            ))}
      
        {!reservation.val().numOfStop && <p style={{ paddingLeft:10 }}>0</p> }
      </div>
       
       <div style={{ display:'flex', flexDirection:'row' }}>
       <h5>Drop Off Address:</h5> 
      <p  style={{ paddingLeft:10 }}>{reservation.val().dropOffAddress}</p>
       </div>

       <div style={{ display:'flex', flexDirection:'row' }}>
       <h5>Total With Tax:</h5> 
      <p  style={{ paddingLeft:10 }}>${reservation.val().totalWithTax}</p>
       </div>

       <div style={{ display:'flex', flexDirection:'row' }}>
       <h5>Vehicle:</h5> 
      <p  style={{ paddingLeft:10 }}>{reservation.val().vehicleDetails?.make} {reservation.val().vehicleDetails?.model && reservation.val().vehicleDetails?.model + ','} {reservation.val().vehicleDetails?.year}</p>
       </div>
              </Card.Text>
              <div>
             {reservation.val().totalWithTax ? <Alert variant="warning">
                <h3>Paid</h3>
              </Alert>
              :
              <Alert variant="danger">
                <span>Incomplete</span>
              </Alert>
              }
             </div>
            </Card.Body>
          </Card>
      
               
              </Col>
        ))}
    </Row>}
  </Container>
}
