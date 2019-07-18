import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './index.css';
import Home from './home';
import HomeLogin from './homeLogin';
import Cookies from 'js-cookie';

if (typeof Cookies.get('token') !== 'undefined') {
  localStorage.setItem('token', Cookies.get('token'));
}

if (typeof Cookies.get('token_id') !== 'undefined') {
  localStorage.setItem('token_id', Cookies.get('token_id'));
}

if (typeof Cookies.get('utype') !== 'undefined') {
  localStorage.setItem('utype', Cookies.get('utype'));
}

if (typeof Cookies.get('epic_id') !== 'undefined') {
  localStorage.setItem('epic_id', Cookies.get('epic_id'));
}

if (typeof Cookies.get('user') !== 'undefined') {
  localStorage.setItem('user', Cookies.get('user'));
}

if (
  window.location.pathname === '/' ||
  window.location.pathname === '/master/login' ||
  window.location.pathname === '/unauthorized'
) {
  if (
    typeof Cookies.get('token_id') === 'undefined' ||
    typeof Cookies.get('token') === 'undefined' ||
    typeof Cookies.get('utype') === 'undefined'
  ) {
    ReactDOM.render(<HomeLogin />, document.getElementById('root'));
  } else {
    ReactDOM.render(<Home />, document.getElementById('root'));
  }
} else {
  ReactDOM.render(<Home />, document.getElementById('root'));
}
