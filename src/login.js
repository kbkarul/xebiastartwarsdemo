import React from 'react';
import { Redirect } from 'react-router-dom';

import LoginAction from './loginActions.js';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {isUserLoggedIn: false, userNameErrorMsg: "", passwordErrorMsg: "", loginBtnText: "Login"};
    this.handleClick = this.handleClick.bind(this);
    this.handleUserLoginAuthChange = this.handleUserLoginAuthChange.bind(this);
  }

  handleUserLoginAuthChange() {
    let userAuthInfo = DataStore.getUserAuthInfo();
    this.setState(userAuthInfo);
  }

  componentWillMount() {
    DataStore.addUserLoginAuthChangeListener(this.handleUserLoginAuthChange);
  }

  componentWillUnmount() {
    DataStore.removeUserLoginAuthChangeListener(this.handleUserLoginAuthChange);
  }

  componentDidMount() {
    this.handleUserLoginAuthChange();
  }

  handleClick() {
    let userName = this.userNameInput.value;
    let pwd = this.passwordInput.value;
    let isValidUserName = userName && userName.trim() !== '';
    let isValidPassword = pwd && pwd.trim() !== '';
    let isValidCredentials = isValidUserName && isValidPassword;
    this.setState({
      userNameErrorMsg: isValidUserName ? '' : 'Please enter name.',
      passwordErrorMsg: isValidPassword ? '' : 'Please enter password.',
      loginBtnText: isValidCredentials ? 'Loading...' : 'Login'
    });

    if(isValidCredentials) {
      LoginAction.authenticateUser(userName, pwd);
    }
}

  render() {
    if(this.state.isUserLoggedIn) {
      return <Redirect to='/search' />;
    }
    return (
      <div className='loginContainer'>
        <div className='loginFormContainer'>
        <h1 className='loginHeader'>SIGN IN </h1>
        <div>
          <div className='loginInputContainer'>
            <div>
              <input type='text' ref={ (input) => this.userNameInput = input} placeholder='Please enter username.'/>
            </div>
            <div className='loginErrorMessage'>
              {this.state.userNameErrorMsg}
            </div>
          </div>
          <div className='loginInputContainer'>
            <div>
              <input type='password' ref={ (input) => this.passwordInput = input } placeholder='Please enter password.'/>
              </div>
              <div className='loginErrorMessage'>
                {this.state.passwordErrorMsg}
              </div>
          </div>
          <div className='loginInputContainer'>
            <div>
               <input className='loginButton' type='button' value={this.state.loginBtnText} onClick={this.handleClick}/>
            </div>
          </div>
        </div>
        </div>
      </div>
      );
  }
}

export default Login;
