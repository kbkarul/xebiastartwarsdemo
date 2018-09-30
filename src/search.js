import React from 'react';
import { Redirect } from 'react-router-dom';

import DataStore from './dataStore.js';
import SearchAction from './searchActions.js';
import Planet from './planet.js';

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      searchRemaining: 15,
      allPlanets: [{name: '', population: 0}, {name: '', population: 0}]
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSearchPlanetsListChange = this.onSearchPlanetsListChange.bind(this);
  }

  handleChange(e) {
    if(DataStore.getRemainingSearchCount() !== 0) {
      SearchAction.filterPlanets(e.target.value.trim());
    }
  }

  onSearchPlanetsListChange() {
    let allPlanetsFromStore = DataStore.getAllPlanetsFromStore();
    this.setState({allPlanets: allPlanetsFromStore, searchRemaining: DataStore.getRemainingSearchCount()});
  }

  componentWillMount() {
    DataStore.addSearchPlanetChangeListener(this.onSearchPlanetsListChange);
  }

  componentDidMount() {
    SearchAction.getAllPlanets();
  }

  componentWillUnmount() {
    DataStore.removeSearchPlanetChangeListener(this.onSearchPlanetsListChange);
  }

  render() {
    const planetsList = this.state.allPlanets.map((planet, i) =>{
      return <Planet planetInfo={planet} planetIndex={i}/>;
    });
    if(!DataStore.getUserAuthInfo().isUserLoggedIn) {
      return <Redirect to='/login' />;
    }
    return (
      <div className='searchContainer'>
      <div className='searchFormContainer'>
        <h1 className='searchHeader'>Search Planets</h1>
        <div className='searchCounter'>Remaining Searches : {this.state.searchRemaining}</div>
        <div>
          <input type='text' onChange={this.handleChange} placeholder='Search Planets by name'/>
        </div>
        <div>
          <div>
            {planetsList}
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default Search;
