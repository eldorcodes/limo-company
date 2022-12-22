import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import React, { useState, useEffect } from 'react';
import Profile from './components/Profile';
import { Container } from 'react-bootstrap';
import './components/firebase';
import  { getAuth, onAuthStateChanged } from 'firebase/auth';
import NotFound from './components/NotFound';
import Header from './components/Navbar';
import Home from './components/Home';
import {
  BrowserRouter as Router, useRoutes
} from 'react-router-dom';

import Password from './components/password';
import About from './components/routes/About';
import NapaValley from './components/routes/NapaValley';
import OAKlimo from './components/routes/OAKlimo';
import Reservation from './components/routes/Reservation';
import Services from './components/routes/Services';
import SFlimo from './components/routes/SFlimo';
import SJClimo from './components/routes/SJClimo';
import SelectVehicle from './components/routes/SelectVehicle';
import Payment from './components/routes/Payment';
import Trips from './components/routes/Trips';


// guestRoutes

const GuestRoutes = () => {
  let routes = useRoutes([
  {
    path:'/',
    element:<Home />
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup />
  },
  {
    path:'/password',
    element:<Password />
  },
  {
    path:'*',
    element:<Login />
  },
  {
    path:'/about',
    element:<About />
  },
  {
    path:'/napavalley',
    element:<NapaValley />
  },
  {
    path:'/oaklimo',
    element:<OAKlimo />
  },
  {
    path:'/reservation',
    element:<Reservation />
  },
  {
    path:'/services',
    element:<Services />
  },
  {
    path:'/sflimo',
    element:<SFlimo />
  },
  {
    path:'/sjclimo',
    element:<SJClimo />
  },
  {
    path:'/selectvehicle',
    element:<SelectVehicle/>
  },
  {
    path:'/payment',
    element:<Payment />
  }
  ])
  return routes
}


//authRoutes

const AuthRoutes = () => {
  let routes = useRoutes([
    {
      path:'/',
      element:<Home />
    },
    {
      path:'*',
      element:<Reservation />
    },
    {
      path:'/about',
      element:<About />
    },
    {
      path:'/napavalley',
      element:<NapaValley />
    },
    {
      path:'/oaklimo',
      element:<OAKlimo />
    },
    {
      path:'/reservation',
      element:<Reservation />
    },
    {
      path:'/services',
      element:<Services />
    },
    {
      path:'/sflimo',
      element:<SFlimo />
    },
    {
      path:'/sjclimo',
      element:<SJClimo />
    },
    {
      path:'/selectvehicle',
      element:<SelectVehicle/>
    },
    {
      path:'/payment',
      element:<Payment />
    },
    {
      path:'/trips',
      element:<Trips />
    }
  ])
  return routes
}
function App() {
const [isLoggedIn, setIsLoggedIn] = useState(false);

let auth = getAuth()

useEffect(() => {
  let findOut = onAuthStateChanged(auth,(user) => {
    if (user) {
      setIsLoggedIn(true)
    }else {
      setIsLoggedIn (false)
    }
  })
  return findOut
},[auth])

 return <Router>
  <Header />
  {isLoggedIn ? <AuthRoutes /> : <GuestRoutes />}
 </Router>
}
export default App;
