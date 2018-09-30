import LoginAPI from './loginAPI.js';
import appConstants from './appConstants.js';
import AppDispatcher from './dispatcher.js';

class LoginUserAction {
  constructor() { }

  checkUserAuthentication() {
    LoginAPI.checkUserAuthentication().then(userAuthResponseJson => this.handleUserAuthPromise(userAuthResponseJson));
  }

  authenticateUser(userName, pwd) {
    LoginAPI.authenticateUser(userName, pwd).then(userAuthResponseJson => this.handleUserAuthPromise(userAuthResponseJson));
  }

  handleUserAuthPromise(userAuthResponseJson) {
      if(userAuthResponseJson.success) {
        AppDispatcher.dispatch({type: appConstants.USER_AUTH_SUCCESS, message: userAuthResponseJson});
      } else {
        AppDispatcher.dispatch({type: appConstants.USER_AUTH_FAILED, message: userAuthResponseJson.message});
      }
  }
}

const LoginAction = new LoginUserAction();
export default LoginAction;
