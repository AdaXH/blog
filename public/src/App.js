import React, { Component } from 'react';
import { Container } from './componets/container/container'
import {
  BrowserRouter  as Router ,
  Route,
} from 'react-router-dom'
import './App.css';
class App extends Component {
  componentDidMount(){
    const con = document.getElementsByClassName('App')[0]
    con.style.height = window.innerHeight + 'px'
    window.addEventListener('resize', () => {
      con.style.height = window.innerHeight + 'px'
    })
  }
  render() {
    return (
      <div className="App">
        <Router>
         <Route path="/" component={Container} />
        </Router>
      </div>
    );
  }
}

export default App;
