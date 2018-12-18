import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import './App.css';
// Usage of Icons Added to Library
library.add(faCoffee, faCheckSquare);


class App extends Component {

  render() {
    return (
      <div className="App">
       <Navbar/>
        <Landing/>
        <Footer/>
      </div>
    );
  }
}

export default App;
