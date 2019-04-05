import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import jwtDecode from 'jwt-decode';
import {setCurrentUser, logoutUser} from './actions/authAction';
import setAuthToken from "./utils/setAuthToken";

import {Provider} from 'react-redux';
import store from './store';


import {library} from '@fortawesome/fontawesome-svg-core'
import {faCoffee, faCheckSquare} from '@fortawesome/free-solid-svg-icons'

import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import './App.css';
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";


// Usage of Icons Added to Library
library.add(faCoffee, faCheckSquare);


// Check for token
if (localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info and exploration
  const decoded = jwtDecode(localStorage.jwtToken);
  // Set user and is Authenticated
  store.dispatch(setCurrentUser(decoded))

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // TODO: Clear current profile
    // Redirect to login
    window.location.href = '/login';

  }
}


class App extends Component {
  render() {
    return (
          <Provider store={store}>
            <Router>
              <div className="App">
                <NavBar/>
                <Route exact path="/" component={Landing}/>
                <div className="container">
                  <Route exact path="/register" component={Register}/>
                  <Route exact path="/login" component={Login}/>
                </div>
                <Footer/>
              </div>
            </Router>
          </Provider>
    );
  }
}

export default App;
