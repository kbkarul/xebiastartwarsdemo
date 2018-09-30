import AppDispatcher from './dispatcher.js';
import appConstants from './appConstants.js';
import { EventEmitter } from 'events';

const CHANGE_EVENT = appConstants.CHANGE_EVENT;
const USER_AUTH_CHANGE_EVENT = appConstants.USER_AUTH_CHANGE_EVENT;
const USER_LOGIN_AUTH_CHANGE_EVENT = appConstants.USER_LOGIN_AUTH_CHANGE_EVENT;
let allPlanets = [];
let filteredPlanets = [];
let userCredententials = {isUserLoggedIn: false, userName: null};
let searchLimit = 15;
let remainingSearchCount = searchLimit;
let searchCountTimer;

class StarWarsDataStore extends EventEmitter {
  constructor() {
    super();
  }

  emitUserAuthChange() {
    this.emit(USER_AUTH_CHANGE_EVENT);
  }

  addUserAuthChangeListener(cb) {
    this.on(USER_AUTH_CHANGE_EVENT, cb);
  }

  removeUserAuthChangeListener(cb) {
    this.removeListener(USER_AUTH_CHANGE_EVENT, cb);
  }

  emitUserLoginAuthChange() {
    this.emit(USER_LOGIN_AUTH_CHANGE_EVENT);
  }

  addUserLoginAuthChangeListener(cb) {
    this.on(USER_LOGIN_AUTH_CHANGE_EVENT, cb);
  }

  removeUserLoginAuthChangeListener(cb) {
    this.removeListener(USER_LOGIN_AUTH_CHANGE_EVENT, cb);
  }


  emitSearchPlanetChange() {
    this.emit(CHANGE_EVENT);
  }

  addSearchPlanetChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
    searchCountTimer = setInterval(this.resetSearchCounter, 60000);
  }

  removeSearchPlanetChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
    clearInterval(searchCountTimer);
  }

  getAllPlanetsFromStore() {
    return filteredPlanets;
  }

  setPlanetsToStore(planets) {
    allPlanets = planets;
    filteredPlanets = planets;
  }

  filterPlanets(searchText) {
    filteredPlanets = allPlanets.filter(p => p.name.startsWith(searchText));
  }

  //to decrement Search Counter
  decrementSearchCounter() {
    remainingSearchCount--;
  }

  //Reset search counter by the set Interval method
  resetSearchCounter() {
    remainingSearchCount = searchLimit;
  }

  getRemainingSearchCount() {
    return Math.max(remainingSearchCount, 0);
  }

  //Set search count limit after user login
  setRemainingSearchCount(userSearchCountLimit) {
    searchLimit = userSearchCountLimit;
    remainingSearchCount = userSearchCountLimit;
  }

  //Set Authentication failed state
  setFailedAuthCheck() {
    userCredententials = {isUserLoggedIn: false};
  }

  //Set Authentication state
  setUserAuthCredentials(authCred) {
    userCredententials = {isUserLoggedIn: authCred.message.success};
  }

  //getter method for user auth
  getUserAuthInfo() {
    return userCredententials;
  }
}

const DataStore = new StarWarsDataStore();

window.DataStore = DataStore;

DataStore.dispatchToken = AppDispatcher.register((action) => {
  switch(action.type) {
    case appConstants.SEARCH_PLANETS:
      DataStore.setPlanetsToStore(action.message);
      DataStore.emitSearchPlanetChange();
      break;

    case appConstants.FILTER_PLANETS:
      DataStore.decrementSearchCounter();
      DataStore.filterPlanets(action.message);
      DataStore.emitSearchPlanetChange();
      break;

   case appConstants.CHECK_USER_AUTH:
      // console.log('Inside CHECK_USER_AUTH dispatcher..');
      break;

    case appConstants.USER_AUTH_SUCCESS:
       DataStore.setUserAuthCredentials(action);
       let userSearchLimit = action.message.searchLimit;
       DataStore.setRemainingSearchCount(userSearchLimit ? userSearchLimit : 15);
       DataStore.emitUserLoginAuthChange();
       break;


    case appConstants.USER_AUTH_FAILED:
       DataStore.setFailedAuthCheck();
       DataStore.emitUserAuthChange();
       break;
  }
});


export default DataStore;
