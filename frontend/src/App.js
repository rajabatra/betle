import logo from './logo.svg';

import React, { useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import Home from './Home'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login setIsLoggedIn={setIsLoggedIn}></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/home' element={isLoggedIn ? <Home></Home> : <Navigate to="/" />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;