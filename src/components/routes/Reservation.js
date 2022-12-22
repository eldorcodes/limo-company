import React,{useState, forwardRef, useEffect, useRef} from 'react';
import { Button, Col, Container, Form, Row, InputGroup, Alert } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PlacesAutocomplete, {
        geocodeByAddress,
        getLatLng,
} from 'react-places-autocomplete';
import '../../App.css';
import { FaTrashAlt, FaLocationArrow, FaTimes, FaUser, FaUsers, FaPlus, FaMinus, FaLuggageCart, FaEnvelope, FaChild, FaBabyCarriage, FaPhone, FaKey, FaCalendar, FaCalendarTimes, FaCalendarDay, FaCalendarAlt } from 'react-icons/fa';
import {GoPlus} from 'react-icons/go';
import { MdRemove, MdAddLocationAlt, MdLocationPin } from 'react-icons/md';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  getDatabase,
  push,
  ref,
  set,
  onValue
} from 'firebase/database';
import '../firebase';
import { getAuth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, onAuthStateChanged, updateProfile} from 'firebase/auth';
import ReactPhoneInput from "react-phone-input-2";
import moment from 'moment';


export default function Reservation() {

  let location = useLocation();
  const navigate = useNavigate();

  const [name,setName] = useState(getAuth().currentUser?.displayName);
  const [email, setEmail] = useState(getAuth().currentUser?.email);

  const [phone,setPhone] = useState('');

  const [startDate, setStartDate] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  const filterPassedDate = (date) => {
    const day = new Date().getDay(date);
    return day !== 0 && day !== 6;
  };

  const [address,setAddress] = useState('');
  const [dropOffAddress,setDropOffAddress] = useState(null);

  const [dropOffLocation,setDropOffLocation] = useState(false);

  const [twoDropOffAddress,setTwoDropOffAddress] = useState('');

  const [option,setOption] = useState('From Airport');

  const [hourly,setHourly] = useState(null);

  const [pickupTitle,setPickupTitle] = useState('Pick Up Location');

  const [addNewStop,setAddNewStop] = useState('');

  const [stop, setStop] = useState('');

  const [numOfStop,setNumberOfStop] = useState([]);
  const [showStopInput, setShowStopInput] = useState(false);
  const [showDropOffInput,setShowDropOffInput] = useState(false);
  const [position,setPosition] = useState(null);

  const [totalMiles,setTotalMiles] = useState(null);
  const [totalTime,setTotalTimes] = useState(null);

  const [newWayPoints,setNewWayPoints] = useState([]);

  const [numOfPassengers,setNumberOfPassengers] = useState(0)

  const [numOfLuggages,setNumOfLuggages] = useState(0)
  const [luggageMessage,setLuggageMessage] = useState('')

  const [childSeatNumber, setChildSeatNumber] = useState(0);
  const [childMessage, setChildMessage] = useState('');

  const [showChildSeat,setShowChildSeat] = useState(false);

  const [price,setPrice] = useState(0)

  const [center,setCenter] = useState({
    lat: 37.7749,
    lng: -122.4194
  })

  const [message,setMessage] = useState('')

  const [showPasswordInput,setShowPasswordInput] = useState(false);

  const [isNavigate,setIsNavigate] = useState(false);

  const [displayForgetPasswordForm,setDisplayForgetPasswordForm] = useState(false)

  const [successMessage,setSuccessMessage] = useState(null)

  const [passwordPlaceholder,setPasswordPlaceholder] = useState('Enter password');


  console.log('TOTAL MILES -----', totalMiles);
  console.log('TOTAL TIME ---- ', totalTime);

  let pickupRef = useRef();
  let dropOffRef = useRef();


  ////// pickup address with coords lat lng
  const [pickupAddressWithCoords,setPickupAddressWithCoords] = useState({
    position:null,
    stop:null
  });
  const [dropOffAddressWithCoords,setDropOffAddressWithCoords] = useState({
    position:null,
    stop:null
  });

  const [twoDropOffAddressWithCoords,setTwoDropOffAddressWithCoords] = useState({
    position:null,
    stop:null
  });

  ///////////////////-----------google map state------------------/////////////
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAC5A-3Jg49AUAmZl1zwUYEy-g5-XQQ9tY",
    libraries: ['places'],
  })
  const [map, setMap] = React.useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)

  const [textDistance,setTextDistance] = useState(null)
  const [textDuration,setTextDuration] = useState(null)

  const [validated, setValidated] = useState(false);

  const [errorMessage,setErrorMessage] = useState('');

  const [password,setPassword] = useState(null);

  const [resetEmail,setResetEmail] = useState('')


  function getReservation(){
    onValue(ref(getDatabase(),`reservation/`),(reservations) => {
      reservations.forEach((res) => {
        console.log(res);
      })
    })
  }


  getReservation()


  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      if (numOfPassengers === 0) {
        setMessage('Please select passengers')
      }
    }else{
     if (isLoggedIn) {
      push(ref(getDatabase(),`reservation/`),{
        pickupAddress:address,
        pickupAddressWithCoords,
        dropOffAddress,
        dropOffAddressWithCoords,
        numOfStop,
        numOfLuggages,
        numOfPassengers,
        distance,
        duration,
        textDistance,
        textDuration,
        startDate,
        option,
        date:new Date().toString(),
        hourly,
        name,
        email,
        pwd:password,
        uid:getAuth().currentUser.uid,
        price,
        childSeatNumber,
        phone
      })
     setMessage('')
     navigate("/selectvehicle");
     } else {
      //navigate('/login')
      setShowPasswordInput(true);
      signInWithEmailAndPassword(getAuth(),email,password)
      .then(() => {
        push(ref(getDatabase(),`reservation/`),{
          pickupAddress:address,
          pickupAddressWithCoords,
          dropOffAddress,
          dropOffAddressWithCoords,
          numOfStop,
          numOfLuggages,
          numOfPassengers,
          distance,
          duration,
          textDistance,
          textDuration,
          startDate,
          option,
          date:new Date().toString(),
          hourly,
          name,
          email,
          pwd:password,
          uid:getAuth().currentUser.uid,
          price,
          childSeatNumber,
          phone
        })
       setMessage('')
       navigate("/selectvehicle");
      })
      .catch(e => {
        console.log(e.message);
        //
        if (e.message === 'Firebase: Error (auth/user-not-found).') {
          createUserWithEmailAndPassword(getAuth(),email,password)
          .then(() => {
            updateProfile(getAuth().currentUser,{
              displayName:name,
            })
            .then(() => {
              // save user
              push(ref(getDatabase(),`users`),{
                username:name,
                email,
                date:new Date().toString()
              })
              // save reservation
              push(ref(getDatabase(),`reservation/`),{
                pickupAddress:address,
                pickupAddressWithCoords,
                dropOffAddress,
                dropOffAddressWithCoords,
                numOfStop,
                numOfLuggages,
                numOfPassengers,
                distance,
                duration,
                textDistance,
                textDuration,
                startDate,
                option,
                date:new Date().toString(),
                hourly,
                name,
                email,
                pwd:password,
                uid:getAuth().currentUser.uid,
                price,
                childSeatNumber,
                phone
              })
             setMessage('')
             navigate("/selectvehicle");
            })
          })
        }else if(e.message === 'Firebase: Error (auth/wrong-password).'){
          //
        }
      })
     }
    }
    setValidated(true);
  };



  ///////////// SAVE DATA INTO FIREBASE REALTIME DATABASE /////////////////////////
  /////////////////////////////////////////////////////////////////////////////////


  async function calculateRoute() {
    if (address === '' || dropOffAddress === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: address,
      destination: dropOffAddress,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
       // eslint-disable-next-line no-undef
      waypoints:newWayPoints,
      optimizeWaypoints:true 
    })
    console.log('RESULT --- ', results);

    setTextDistance(results.routes[0].legs[0].distance.text.substring(0,results.routes[0].legs[0].distance.text.indexOf(' ')))
    setTextDuration(results.routes[0].legs[0].duration.text)

    console.log('RESULT ROUTES LEGS distance text ------', results.routes[0].legs[0].distance.text);
    console.log('RESULT ROUTES LEGS duration text ------', results.routes[0].legs[0].duration.text);

    setDirectionsResponse(results)
    setTotalMiles(((results.routes[0].legs[0].distance.value + results.routes[0].legs[1].distance.value) / 1609).toFixed(2))


     // calculate with stops
      // function to calculate total distance 
    function CalculateTotalDistance(){
      let totalDistance = 0;
    results.routes[0].legs.forEach((route) => {
      totalDistance += route.distance.value
    })
    return totalDistance
    }
/// calculate duration 
function CalculateTotalDuration(){
  let totalDuration = 0;

  results.routes[0].legs.forEach((route) => {
    totalDuration += route.duration.value
  })

return totalDuration

}

function SecondsToHoursAndMinutes(){
  let totalDuration = CalculateTotalDuration()
  var hours = (totalDuration / 3600);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);

return rhours + " hr " + rminutes + " min."
}

  console.log('CALCULATE DURATION TOTAL ---- ',SecondsToHoursAndMinutes());
    setDistance((CalculateTotalDistance() / 1609).toFixed(2))
    setDuration(SecondsToHoursAndMinutes())
    console.log('CALCULATE TOTAL DISTANCE', (CalculateTotalDistance() / 1609).toFixed(2));
       // calculate with stops
      // function to calculate total distance 
    function CalculateTotalDistance(){
      let totalDistance = 0;
    results.routes[0].legs.forEach((route) => {
      totalDistance += route.distance.value
    })
    return totalDistance
    }
/// calculate duration 
function CalculateTotalDuration(){
  let totalDuration = 0;

  results.routes[0].legs.forEach((route) => {
    totalDuration += route.duration.value
  })

return totalDuration

}

function SecondsToHoursAndMinutes(){
  let totalDuration = CalculateTotalDuration()
  var hours = (totalDuration / 3600);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);

return rhours + " hr " + rminutes + " min."
}

  console.log('CALCULATE DURATION TOTAL ---- ',SecondsToHoursAndMinutes());
    setDistance((CalculateTotalDistance() / 1609).toFixed(2))
    setDuration(SecondsToHoursAndMinutes())
    console.log('CALCULATE TOTAL DISTANCE', (CalculateTotalDistance() / 1609).toFixed(2));
    
    
      
   
  }

  function clearRoute() {
    setCenter(null)
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setAddress('')
    setDropOffAddress('')
    setDropOffLocation(false)
    setDropOffAddressWithCoords({
      position:null,
      stop:null
    })
    setPickupAddressWithCoords({
      position:null,
      stop:null
    })
    setNewWayPoints([])
    setTextDistance('')
    setTextDuration('')
    onUnmount()
    setCenter({
      lat: 37.7749,
      lng: -122.4194
    })
  }

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  /////////////////-----------google map state Ends here------------///////////

  //////////////-----------------google map style------------------////////////////
  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  
  //////////////---------------google map style Ends here-----------------////////////

  /////////////----------------add New Stop---------------------////////////////
  function addStop(){
    if (stop !== '') {
    setNumberOfStop([...numOfStop,{position,stop}])
    setNewWayPoints([...newWayPoints,{location:stop,stopover:true}])
    setStop('')
    }
  }

  async function deleteStop(data){
      let filteredWayPoints = newWayPoints.filter((stop) => stop !== data)
      setNewWayPoints(filteredWayPoints)
  }

  console.log('NUM OF STOPS ARRAY -- ', numOfStop)

function handleChange(value){
  setAddress(value)
}

function handleSelect(address){
  geocodeByAddress(address)
      .then(results => {
        setAddress(address)
        getLatLng(results[0]).then((coords) => {
          console.log('COORDS--',coords);
          setPosition(coords)
          setPickupAddressWithCoords({
            position:coords,
            stop:address
          })
          //setNumberOfStop([{position:coords,stop:address},...numOfStop])
        }).catch(e => console.log(e))
      })
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
}

function handleDropOffAddress(value){
  setDropOffAddress(value)
}

function handleSelectDropOffAddress(address){
  geocodeByAddress(address)
      .then(results => {
        setDropOffAddress(address)
        setDropOffLocation(true)
        getLatLng(results[0]).then((coords) => {
          console.log('COORDS--',coords);
          setPosition(coords)
          setDropOffAddressWithCoords({
            position:coords,
            stop:address
          })
          //setNumberOfStop([...numOfStop,{position:coords,stop:value}])
        }).catch(e => console.log(e))
        
      })
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
}
///////////second dropoff /////
function handleTwoDropOffAddress(value){
  setTwoDropOffAddress(value)
}

function handleSelectTwoDropOffAddress(address){
  geocodeByAddress(address)
      .then(results => {
        setTwoDropOffAddress(address)
        getLatLng(results[0]).then((coords) => {
          console.log('COORDS--',coords);
          setPosition(coords)
          setTwoDropOffAddressWithCoords({
            position:coords,
            stop:address
          })
          //setNumberOfStop([...numOfStop,{position:coords,stop:value}])
        }).catch(e => console.log(e))
        
      })
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
}
/////////////////////////

const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  <InputGroup hasValidation>
   <InputGroup.Text id="inputGroupPrepend">
              <FaCalendarAlt />
            </InputGroup.Text>
  <Form.Control 
  autoComplete='off'
  placeholder='Choose date'
  style={{width:'80%', padding:5, cursor:'pointer', height:38 }} 
  className="example-custom-input" 
  value={value} 
  onClick={onClick} 
  ref={ref}
  required
  />
  <Form.Control.Feedback>Looks good</Form.Control.Feedback>
  <Form.Control.Feedback type='invalid'>Choose date</Form.Control.Feedback>
  </InputGroup>
  
));

function handleNewStopChange(val){
  setStop(val)
}


function handleNewStopSelect(value){
  geocodeByAddress(value)
      .then(results => {
        setStop(value)
        getLatLng(results[0]).then((coords) => {
          console.log('COORDS--',coords);
          setPosition(coords)
        }).catch(e => console.log(e))
        
      })
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
}

/// function with parameters
function calculateTotal(a,b){
return a * b
}
// method
console.log('CALCULATE TOTAL -- ',calculateTotal(2,4));



useEffect(() => {
  (async function loadDistance(){
    await calculateRoute()
  })()
},[address,dropOffAddress,newWayPoints])


useEffect(() => {
  let findOut = onAuthStateChanged(getAuth(),(user) => {
    if (user) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  })
  return findOut
},[isLoggedIn])

function checkUserAndOpenCalendar(){
  // check if user exist in database
  onValue(ref(getDatabase(),`users`),(users) => {
    users.forEach((user) => {
      if (user && user.val().email === email && !isLoggedIn) {
        // login to proceed
        setShowPasswordInput(true)
        setPasswordPlaceholder('You already have an account. Enter your password')
      }else if (user.val().email === email && isLoggedIn) {
        // login to proceed
        setShowPasswordInput(false)
      }
      else{
        // signup register new account
        setShowPasswordInput(true)
        setPasswordPlaceholder('Enter new password to create an account')
      }
    })
  })
}


  return (
   <>
   {displayForgetPasswordForm ? <Container>
    {successMessage && <>
    <p style={{ textAlign:'center', color:'red' }}>{successMessage}</p>
    </>}
    <div>
    <Form.Group className='mb-3' controlId="validationCustom01">
       <InputGroup hasValidation>
         <InputGroup.Text id="inputGroupPrepend">
           <FaEnvelope />
         </InputGroup.Text>
         <Form.Control
         value={email}
         onChange={(v) => { 
          setResetEmail(v.target.value)
         }}
           type="text"
           placeholder="Enter your email"
           aria-describedby="inputGroupPrepend"
           required
         />
         <Button 
         style={{
          borderTopRightRadius:5,
          borderBottomRightRadius:5
         }}
         onClick={() => {
          sendPasswordResetEmail(getAuth(),resetEmail?resetEmail:email)
          .then(() => {
            setSuccessMessage('Password reset instructions have been mailed. Check your email to update password')
          })
          .catch((e) => {
            setErrorMessage(e.message)
          })
         } }>Reset password</Button>
         <Form.Control.Feedback type="invalid">
           Please enter email address.
         </Form.Control.Feedback>
         <Form.Control.Feedback>Looks good</Form.Control.Feedback>
       </InputGroup>
     </Form.Group>

     {successMessage && <p style={{ textAlign:'center' }}> <Button variant='link' onClick={() => setDisplayForgetPasswordForm(false) }>
      Return to previous page
    </Button></p>}
    </div>
   </Container>
   :
   <Container>
   <h1 className='center'>{'Make a reservation'}</h1>
   

   <Form noValidate validated={validated} onSubmit={handleSubmit}>
     <p className='red center'>{errorMessage}</p>
   <Row className="mb-3">
     <Form.Group as={Col} md="6" className='mb-3' controlId="validationCustom01">
       <Form.Label>Name</Form.Label>
      <InputGroup hasValidation>
      <InputGroup.Text id="inputGroupPrepend">
           <FaUser />
         </InputGroup.Text>
       <Form.Control
       value={name}
         onChange={(v) => setName(v.target.value)}
         required
         type="text"
         placeholder="Enter your name"
       />
       <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
       <Form.Control.Feedback type='invalid'>Please enter name</Form.Control.Feedback>
       </InputGroup>
     </Form.Group>

     <Form.Group as={Col} md="6" className='mb-3' controlId="validationCustom01">
       <Form.Label>Email</Form.Label>
       <InputGroup hasValidation>
         <InputGroup.Text id="inputGroupPrepend">
           <FaEnvelope />
         </InputGroup.Text>
         <Form.Control
         value={email}
         onChange={(v) => setEmail(v.target.value)}
           type="text"
           placeholder="Enter your email"
           aria-describedby="inputGroupPrepend"
           required
         />
         <Form.Control.Feedback type="invalid">
           Please enter email address.
         </Form.Control.Feedback>
         <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
       </InputGroup>
     </Form.Group>

     {showPasswordInput && <Form.Group as={Col} md="6" className='mb-3' controlId="validationCustom01">
       <Form.Label>Password</Form.Label>
       <InputGroup hasValidation>
         <InputGroup.Text id="inputGroupPrepend">
           <FaKey />
         </InputGroup.Text>
         <Form.Control
         
         onChange={(v) => setPassword(v.target.value)}
           type="password"
           placeholder={passwordPlaceholder}
           aria-describedby="inputGroupPrepend"
           required
         />
         <Form.Control.Feedback type="invalid">
           Please enter password. <Button variant='link' onClick={() => setDisplayForgetPasswordForm(true) }>Forgot password?</Button>
         </Form.Control.Feedback>
         <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
       </InputGroup>
     </Form.Group>}

     <Form.Group as={Col} md="6" className='mb-3' controlId="validationCustom01">
     <Form.Label>Pick Up Date</Form.Label>
         <DatePicker
         customInput={<ExampleCustomInput />}
         className='date-picker'
           selected={startDate}
           onChange={(date) => setStartDate(date)}
           showTimeSelect
           filterTime={filterPassedTime}
          onCalendarOpen={checkUserAndOpenCalendar}
           dateFormat="MMM d, yyyy h:mm aa"
           timeFormat="HH:mm"
           timeIntervals={5}
           timeCaption="time"
           minDate={new Date()}
         />
    
     </Form.Group>

     <Form.Group as={Col} md="6" controlId="validationCustom01">
     <Form.Label>Phone</Form.Label>
     <ReactPhoneInput
     inputStyle={{
       width:'100%',
       height:38
     }}
       inputExtraProps={{
         name: "phone",
         required: true,
         autoFocus: true,
       }}
       defaultCountry={"us"}
       value={phone}
       onChange={(v) => setPhone(v)}
     />
     </Form.Group>

    
     
   </Row>
   <Row>
   <Form.Group as={Col} className='mb-3' controlId="validationCustom01">
       <Form.Label>Select service type</Form.Label>
       <Form.Select aria-label="Default select example"
       onChange={(val) => {
         console.log(val.target.value)
         setOption(val.target.value)
         setShowDropOffInput(false)
         if (val.target.value === "Hourly As Directed") {
           setHourly(3)
         }
       }}
       >
       <option value={'From Airport'}>From Airport</option>
       <option value="To Airport">To Airport</option>
       <option value="Transfer">Transfer</option>
       <option value="Hourly As Directed">Hourly As Directed (Minimum Hours Required)</option>
      </Form.Select>
     </Form.Group>


     {option === 'Hourly As Directed' && <Form.Group as={Col} className='mb-3' controlId="validationCustom01">
       <Form.Label>Select hours</Form.Label>
       <Form.Select aria-label="Default select example"
       onChange={(val) => {
         setHourly(val.target.value)
       }}
       >
       <option selected value={'3'}>3 hours</option>
       <option value={'4'}>4 hours</option>
       <option value={'5'}>5 hours</option>
       <option value={'6'}>6 hours</option>
       <option value={'7'}>7 hours</option>
       <option value={'8'}>8 hours</option>
      </Form.Select>
     </Form.Group>}


   </Row>

   <Row>
   <Form.Group className='mb-3' controlId="validationCustom01">
       <Form.Label>{option === 'From Airport' ? 'Pick Up Airport' : pickupTitle}</Form.Label>
       <br/>
       <Row>
         
         <Col md={11}>
         <PlacesAutocomplete
         value={address}
         onChange={handleChange}
         onSelect={handleSelect}
   >
     {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
       <Form.Group>
         <Form.Control
         ref={pickupRef}
         value={address}
         style={{width:'100%',padding:5, height:38 }}
           {...getInputProps({
             placeholder: 'Search Places ...',
             className: 'location-search-input',
           })}
           required
         />
         <Form.Control.Feedback>Looks good</Form.Control.Feedback>
         <Form.Control.Feedback type='invalid'>Please enter pickup address</Form.Control.Feedback>
         <div className="autocomplete-dropdown-container">
           {loading && <div>Loading...</div>}
           {suggestions.map(suggestion => {
             const className = suggestion.active
               ? 'suggestion-item--active'
               : 'suggestion-item';
             // inline style for demonstration purpose
             const style = suggestion.active
               ? { backgroundColor: '#fafafa', cursor: 'pointer' }
               : { backgroundColor: '#ffffff', cursor: 'pointer' };
             return (
               <div
                 {...getSuggestionItemProps(suggestion, {
                   className,
                   style,
                 })}
               >
                 <span>{suggestion.description}</span>
               </div>
             );
           })}
         </div>
       </Form.Group>
     )}
   </PlacesAutocomplete>
         </Col>

         <Col>
         <FaTimes fontSize={20} onClick={clearRoute} />
         </Col>

       </Row>
       <Form.Control.Feedback type="invalid">
         Please provide a valid city.
       </Form.Control.Feedback>
     </Form.Group>
   </Row>

   <Row className="mb-3">
     
   {dropOffLocation ? <p className='add-stop' 
   onClick={() => setShowStopInput(!showStopInput)} 
   style={{cursor:'pointer', color:'blue'}}>
    {!showStopInput ? <GoPlus /> : <MdRemove />} 
    {!showStopInput ? 'Add' : 'Remove'} Stop</p>
    :
    <Alert variant='info' style={{ color:'black',fontSize:18 }}>You can add stops after you enter your drop off location</Alert>
    }

   {showStopInput && <div>
         <Form.Group controlId="validationCustom01">
         <Form.Label>Enter address</Form.Label>
         <Row>
           <Col md={1}><MdAddLocationAlt /></Col>
           <Col md={9}>
           <PlacesAutocomplete
       value={stop}
       onChange={handleNewStopChange}
       onSelect={handleNewStopSelect}
     >
       {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
         <div>
           <Form.Control
            onChange={handleNewStopChange}
           value={stop}
           style={{width:'100%',height:38, padding:5 }}
             {...getInputProps({
               placeholder: 'Search Places ...',
               className: 'location-search-input',
             })}
           />
           <div className="autocomplete-dropdown-container">
             {loading && <div>Loading...</div>}
             {suggestions.map(suggestion => {
               const className = suggestion.active
                 ? 'suggestion-item--active'
                 : 'suggestion-item';
               // inline style for demonstration purpose
               const style = suggestion.active
                 ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                 : { backgroundColor: '#ffffff', cursor: 'pointer' };
               return (
                 <div
                   {...getSuggestionItemProps(suggestion, {
                     className,
                     style,
                   })}
                 >
                   <span>{suggestion.description}</span>
                 </div>
               );
             })}
           </div>
           
         </div>
       )}
     </PlacesAutocomplete>
             </Col>

             <Col md={2}>
             <Button 
             onClick={addStop}
             style={{cursor:'pointer'}}>
               <GoPlus 
              /> Add Stop</Button>
             </Col>
         </Row>
       </Form.Group>
         </div>}
   </Row>



   <Row>
     {newWayPoints.map((data,index) => {
       return (
         <>
         <Col md={3}>
           <p>
          
           <>{'Stop    ' + (index + 1) + ' :'}</>
       
           </p>
         </Col>
         <Col md={8}>
         <p>
         {data.location}
         </p>
         </Col>
         <Col md={1}>
         <FaTrashAlt
         style={{
           cursor:'pointer'
         }}
          onClick={() => deleteStop(data,index)} />
         </Col>
         </>
       )
     }) }
     </Row>


     {option === 'Hourly As Directed' &&
     <Form.Group controlId="validationCustom02">
     <Form.Check
     onChange={() => {
       setShowDropOffInput(!showDropOffInput)
     }}
     checked={showDropOffInput}
     type='switch'
     label='Return at different location'
     />
     </Form.Group>
     }

    {option !== 'Hourly As Directed' && <Form.Group controlId="validationCustom03">
       <Form.Label>{option === 'To Airport' ? 'Drop Off Airport' : 'Drop Off Location'}</Form.Label>
       <br/>
       <Row>
         <Col md={11}>
         <PlacesAutocomplete
     value={dropOffAddress}
     onChange={handleDropOffAddress}
     onSelect={handleSelectDropOffAddress}
   >
     {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
       <div>
         <Form.Control
         ref={dropOffRef}
         value={dropOffAddress}
         style={{width:'100%',padding:5, height:38 }}
           {...getInputProps({
             placeholder: 'Search Places ...',
             className: 'location-search-input',
           })}
           required
         />
         <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
         <Form.Control.Feedback type='invalid'>Please enter dropoff address</Form.Control.Feedback>
         <div className="autocomplete-dropdown-container">
           {loading && <div>Loading...</div>}
           {suggestions.map(suggestion => {
             const className = suggestion.active
               ? 'suggestion-item--active'
               : 'suggestion-item';
             // inline style for demonstration purpose
             const style = suggestion.active
               ? { backgroundColor: '#fafafa', cursor: 'pointer' }
               : { backgroundColor: '#ffffff', cursor: 'pointer' };
             return (
               <div
                 {...getSuggestionItemProps(suggestion, {
                   className,
                   style,
                 })}
               >
                 <span>{suggestion.description}</span>
               </div>
             );
           })}
         </div>
       </div>
     )}
   </PlacesAutocomplete>
         </Col>
         <Col>
         <FaTimes fontSize={20} onClick={clearRoute} />
         </Col>
       </Row>
     </Form.Group>}



     {showDropOffInput && <Form.Group controlId="validationCustom04">
       <Form.Label>{'Drop Off Location'}</Form.Label>
       <br/>
       <Row>
         <Col>
         <PlacesAutocomplete
     value={dropOffAddress}
     onChange={handleDropOffAddress}
     onSelect={handleSelectDropOffAddress}
   >
     {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
       <div>
         <Form.Control
         required
         value={dropOffAddress}
         style={{width:'100%'}}
           {...getInputProps({
             placeholder: 'Search Places ...',
             className: 'location-search-input',
           })}
         />
         <Form.Control.Feedback>Looks good</Form.Control.Feedback>
         <Form.Control.Feedback type='invalid'>Please enter dropoff address</Form.Control.Feedback>
         <div className="autocomplete-dropdown-container">
           {loading && <div>Loading...</div>}
           {suggestions.map(suggestion => {
             const className = suggestion.active
               ? 'suggestion-item--active'
               : 'suggestion-item';
             // inline style for demonstration purpose
             const style = suggestion.active
               ? { backgroundColor: '#fafafa', cursor: 'pointer' }
               : { backgroundColor: '#ffffff', cursor: 'pointer' };
             return (
               <div
                 {...getSuggestionItemProps(suggestion, {
                   className,
                   style,
                 })}
               >
                 <span>{suggestion.description}</span>
               </div>
             );
           })}
         </div>
       </div>
     )}
   </PlacesAutocomplete>
         </Col>
       </Row>
     </Form.Group>}


     <div style={{ flexDirection:'row',display:'flex',justifyContent:'space-evenly'}}>
   <h5 style={{ alignSelf:'flex-start' }}>
     Distance: {newWayPoints.length > 0 ? (distance + ' mi') : textDistance && (textDistance + ' mi')}

   </h5>
   <h5 style={{alignSelf:'flex-end'}}> Duration: { newWayPoints.length > 0 ? duration : textDuration }</h5>
   </div>
   <br/>


   {isLoaded &&
   <GoogleMap
     mapContainerStyle={containerStyle}
     center={center}
     zoom={9}
     options={{
     streetViewControl:false,
     fullscreenControl:false,
   }}
   onLoad={onLoad}
   onUnmount={onUnmount}
   >
     {pickupAddressWithCoords.position && <MarkerF position={{ lat:pickupAddressWithCoords.position.lat, lng:pickupAddressWithCoords.position.lng }}  />}
     {/* {numOfStop.map((stop,index) => (
     <MarkerF key={index} position={{ lat: stop.position.lat, lng: stop.position.lng }} />
   ))} */}
   {dropOffAddressWithCoords.position && <MarkerF position={{ lat: dropOffAddressWithCoords.position.lat, lng:dropOffAddressWithCoords.position.lng }} />}

   {directionsResponse && (
         <DirectionsRenderer directions={directionsResponse} />
       )}

   </GoogleMap>
   }
   <br />
   <br />

   <h3>Number of Passenger</h3>
   <p style={{color:'red'}}>{message}</p>
   <div className='passenger-row'>
     <div className='passenger-col'>
       <FaUsers/>
     </div>
     <div  onClick={() => {
         if (numOfPassengers > 0) {
           setNumberOfPassengers(numOfPassengers - 1)
           setMessage('')
         }
       }}
     className='passenger-col'>
       <FaMinus/>
     </div>
     <div className='passenger-col'>
       {numOfPassengers}
     </div>
     <div  onClick={() => {
         if (numOfPassengers === 7) {
           setMessage('You have reached a maximum limit of passengers.')
           setLuggageMessage('You are not allowed to have more than 4 luggages')
         }else{
           setNumberOfPassengers(numOfPassengers + 1)

         }
       }} 
     className='passenger-col'>
       <FaPlus/>
     </div>
   </div>

   <br />

   <h3>Luggage Count</h3>
   <p style={{color:'red'}}>{luggageMessage}</p>
   <div className='passenger-row'>
     <div className='passenger-col'>
       <FaLuggageCart />
     </div>
     <div 
     onClick={() => {
       if (numOfLuggages > 0) {
         setNumOfLuggages(numOfLuggages - 1)
         setLuggageMessage('')
       }
     }}
     className='passenger-col'>
       <FaMinus />
     </div>

     <div className='passenger-col'>
       {numOfLuggages}
     </div>
     <div 
     onClick={() => {
       if (numOfPassengers === 7 && numOfLuggages === 4) {
         setLuggageMessage('You have reached a maximum limit.')
       }else
       if (numOfLuggages == 5) {
         setLuggageMessage('You are allowed to have up to 4 passengers.')
         setNumOfLuggages(numOfLuggages + 1)
       }else if (numOfLuggages == 10 && numOfPassengers <= 2) {
         setLuggageMessage('You have reached a maximum limit of luggage count.')
       }else if (numOfPassengers <= 2) {
         setNumOfLuggages(numOfLuggages + 1)
       }else if (numOfPassengers === 2 && numOfLuggages === 10) {
         setLuggageMessage('You have reached a maximum limit of luggage count.')
       }
       else{
         setNumOfLuggages(numOfLuggages + 1)
       }
     }}
     className='passenger-col'>
       <FaPlus />
     </div>
   </div>

<br />

   {<Form.Group controlId="validationCustom02">
     <Form.Check
     onChange={() => {
       setShowChildSeat(!showChildSeat)
     }}
     checked={showChildSeat}
     type='switch'
     label='Add Child Seat'
     />
     </Form.Group>}

     <br />

    {showChildSeat && <div>
   <h3>Child Seat</h3>
   <p style={{color:'red'}}>{childMessage}</p>
   <div className='passenger-row'>
     <div className='passenger-col'>
       <FaBabyCarriage />
     </div>
     <div 
     onClick={() => {
       if (childSeatNumber > 0) {
         setChildSeatNumber(childSeatNumber - 1)
         setChildMessage('')
       }
     }}
     className='passenger-col'>
       <FaMinus />
     </div>
     
     <div className='passenger-col'>
       {childSeatNumber}
     </div>
     <div 
     onClick={() => {
      if (childSeatNumber === 2) {
       setChildMessage('Up to 2 child seats allowed')
     }else{
       setChildSeatNumber(childSeatNumber + 1)
     }
     }}
     className='passenger-col'>
       <FaPlus />
     </div>
   </div>
   </div>}



   {/* <Form.Group className="mb-3">
     <Form.Check
       required
       label="Agree to terms and conditions"
       feedback="You must agree before submitting."
       feedbackType="invalid"
     />
   </Form.Group> */}

   <br/>
   <Form.Group className='d-grid gap-2'>
   <Button type="submit">Submit Form</Button>
   </Form.Group>
 </Form>
   
   <div style={{height:200}}></div>
 </Container>
   }
   </>
  )
}
