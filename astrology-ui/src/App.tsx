import React, { useState } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import {BrowserRouter as Router, Route} from "react-router-dom" //just changed name of router

import { User } from './models/User';

import { LoginComponent } from './components/LoginComponent/LoginComponent'
import { NavBarComponent } from './components/NavBarComponent/NavBarComponent';
import { ProfileComponent } from './components/ProfileComponent/ProfileComponent';
import { HomeComponent } from './components/HomeComponent/HomeComponent'
import { SignUpComponent } from './components/SignUpComponent/SignUpComponent';
import { UpdateProfileComponent } from './components/UpdateProfileComponent/UpdateProfileComponent';
import { LogOutComponent } from './components/LogoutComponent/LogoutComponent';

//import { AllUsersComponent } from './components/AllUsersComponent/AllUsersComponent';


function App() {
  const [currentUser, changeCurrentUser] = useState<null | User>(null)

  return (
    <div className="App">
      <Router>
        <NavBarComponent user={currentUser}/>
        {/*Route path='/users' component={AllUsersComponent}/> */}
        <Route path='/home' component={HomeComponent}/>
        {/*Figure out how to make this the start up screen */}
        <Route path='/login' render={(props)=>(<LoginComponent changeCurrentUser={changeCurrentUser} {...props} />)} />
        <Route path='/user/profile/:userId' component={ProfileComponent}/>
        <Route path='/user/update/:userId' render={(props)=>(<UpdateProfileComponent user={currentUser} {...props}/>)}/>
        <Route path='/register' render={(props)=>(<SignUpComponent changeCurrentUser={changeCurrentUser} {...props} />)}/>
        <Route path='/logout' render={(props)=>(<LogOutComponent changeCurrentUser={changeCurrentUser} {...props}/>)}/>
        <br/>
      </Router>
      <ToastContainer position="bottom-right"/>
    </div>
  );
}

export default App;
