import appConstants from './appConstants.js';

class SearchPlanetAPI {
  constructor() {}
  async getAllPlanets() {
    let allPlanetsResponse = await fetch('/getAllPlanets');
    let allPlanetsJson = await allPlanetsResponse.json();
    return allPlanetsJson.allPlanets;
  }
}

const SearchAPI = new SearchPlanetAPI();

export default SearchAPI;
