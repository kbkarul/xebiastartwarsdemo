import appConstants from './appConstants.js';

class LoginUserAPI {
  constructor() {}
  async checkUserAuthentication() {
    let userAuthResponse = await fetch('/api/checkUserAuthentication');
    let userAuthResponseJson = await userAuthResponse.json();
    return userAuthResponseJson;
  }

  async authenticateUser(userName, pwd) {
    let userAuthResponse = await fetch('/authenticateUser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        userName: userName,
        password: pwd
      })
    });
    let userAuthResponseJson = await userAuthResponse.json();
    return userAuthResponseJson;
  }
}

const LoginAPI = new LoginUserAPI();

export default LoginAPI;
