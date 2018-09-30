import React from 'react';

class Planet extends React.Component {
  constructor() {
    super();
  }

  render() {
      const planet = this.props.planetInfo;
      const i = this.props.planetIndex;
      const population = planet.population;
      const h = (i+20) + 'px';
      const padding = (i/4 + 10) + 'px 5px';
      const fontSize = (i/4 + 15) + 'px';
      return (<div className='planetContainer' style={{height: h, padding: padding, 'font-size':fontSize}}>
        {planet.name}
      </div>);
  }
}

export default Planet;
