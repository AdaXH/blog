import React, { Component } from 'react';
import { Container } from './componets/container/container'
import { connect } from 'react-redux'
import { Dialog } from './componets/dialog/dialog'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import './App.css'
import { API } from './request/request';

class UI extends Component {
  componentDidMount() {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    !(/customer/.test(document.cookie)) && API('/get-customer').then(result => {
      if (result.success) {
        API('/add-customer', 'POST', { number: result.data.number + 1 })
        document.cookie = 'customer=customer; path=/; expires=' + d
      }
    })
    const con = document.getElementsByClassName('App')[0]
    con.style.height = window.innerHeight + 'px'
    window.addEventListener('resize', () => {
      con.style.height = window.innerHeight + 'px'
    })
  }
  render() {
    return (
      <div className="App">
        {this.props.visible && <Dialog />}
        <Router>
          <Route path="/" component={Container} />
        </Router>
      </div>
    );
  }
}
export const App = connect(state => {
  return {
    visible: state.dialog.visible
  }
}, () => {
  return {

  }
})(UI)
