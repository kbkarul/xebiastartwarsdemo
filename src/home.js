import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Search from './search.js';
import Login from './login.js';
import LoginAction from './loginActions.js';
import DataStore from './dataStore.js';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {isUserLoggedIn: true};
    this.handleUserAuthChange = this.handleUserAuthChange.bind(this);
  }
  handleUserAuthChange() {
    let userAuthInfo = DataStore.getUserAuthInfo();
    this.setState(userAuthInfo);
  }

  componentWillMount() {
    DataStore.addUserAuthChangeListener(this.handleUserAuthChange);
  }

  componentDidMount() {
    LoginAction.checkUserAuthentication();
  }

  componentWillUnmount() {
    DataStore.removeUserAuthChangeListener(this.handleUserAuthChange);
  }

  render() {
    return (<BrowserRouter>
      <div>
      <div className='headerContainer'>
        <ul>
          <li><div className='headerLogoContainer'><img className='headerLogo' src='/logo.png'/></div></li>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/search'>Search</Link></li>
        </ul>
      </div>
      <div>
          <Route exact path="/" component={Login}/>
          <Route path="/login" component={Login}/>
          <Route path="/search" component={Search}/>
      </div>
      </div>
    </BrowserRouter>);
  }
}

export default Home;

ReactDOM.render(
  <Home />,
  document.getElementById('content')
);
