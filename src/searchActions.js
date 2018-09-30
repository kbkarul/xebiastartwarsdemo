import SearchAPI from './searchAPI.js';
import appConstants from './appConstants.js';
import AppDispatcher from './dispatcher.js';

class SearchPlanetAction {
  constructor() { }

  getAllPlanets() {
    SearchAPI.getAllPlanets().then(allPlanetsJson =>
      AppDispatcher.dispatch({type: appConstants.SEARCH_PLANETS, message: allPlanetsJson})
    );
  }

  filterPlanets(name) {
    AppDispatcher.dispatch({type: appConstants.FILTER_PLANETS, message: name})
  }
}

const SearchAction = new SearchPlanetAction();
export default SearchAction;
