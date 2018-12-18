import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faCoffee, faCheckSquare} from '@fortawesome/free-solid-svg-icons'
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import './App.css';
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

// Usage of Icons Added to Library
library.add(faCoffee, faCheckSquare);


class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar/>
                    <Route exact path="/" component={Landing}/>
                    <div className="container">
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/login" component={Login}/>
                    </div>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;
