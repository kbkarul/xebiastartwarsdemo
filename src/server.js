var fetch = require('node-fetch');
var http = require('http');
var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var app = express();
var apiRoutes = express.Router();
const port = 8080;
const appSecret = 'gThUKLrtgFXSjUkiB';

let allPlanets = [];
let allPlanetsTempArray = [];

app.use( express.json() );

app.use( express.static('dist') );

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '/static/index.html'), function(err, data) {
    if(err) {
      res.send(err);
    } else {
      res.setHeader('content-type', 'text/html');
      res.send(data);
    }
    res.end();
  });
});

app.post('/authenticateUser', (req, res) => {
  let userName = req.body.userName.trim();
  let pwd = req.body.password.trim();
  let url = 'https://swapi.co/api/people/?search='+userName;
  fetch(url)
    .then(res => res.json())
    .then(userResJson => {
      let users = userResJson.results.filter(function(user) {
        return user.name == userName && user.birth_year == pwd;
      });
      let isValidUser = users.length > 0;
      if(isValidUser) {
        const payload = {userName: userName};
        let token = jwt.sign(payload, appSecret , {expiresIn: 300000});
        // console.log('token :: ' + token);
        res.json({success: true, searchLimit: userName == 'Luke Skywalker' ? 100 : 15,
            token: token, message: 'User Authentication success.'});
      } else {
        return res.status(403).send({success: false, message: 'User Authentication failed.'});
      }
    });

});

//Routes to verify token
apiRoutes.use((req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, appSecret, function(err, decoded) {
      if(err) {
        return res.json({success: false,message: 'Authentication failed.'});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({success: false, message: 'No token available.'});
  }
  next();
});

app.use('/api', apiRoutes);

app.get('/api/checkUserAuthentication', (req, res) => {
  console.log(JSON.stringify(req.header));
  res.setHeader('content-type', 'application/json');
  res.send({allPlanets: allPlanets});
  res.end();
});

app.get('/getAllPlanets', (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.send({allPlanets: allPlanets});
  res.end();
});

app.listen(port, ()=>{
  console.log(`Server running at ${port}...`);
  getAllPlanetsFromAPI();
});

//Refreshes the data in the interval of 30 mins
setInterval(getAllPlanetsFromAPI, 1800000);

//Fetches data from the API to reduce the number of request
function getAllPlanetsFromAPI() {
  console.log("Going to refresh planets list...");
  getPlanetsData('https://swapi.co/api/planets/');
}

function getPlanetsData(url) {
  let planetsData = [];
  fetch(url)
    .then(res => res.json())
    .then(allPlanetsJson => {
      planetsData = allPlanetsJson.results.map(function(p) {
        let population = p.population === 'unknown' ? 0 : p.population;
        return {name: p.name, population: population};
      });
      for(let key in planetsData) {
        allPlanetsTempArray.push(planetsData[key]);
      }
      if(allPlanetsJson.next) {
         getPlanetsData(allPlanetsJson.next);
      } else {
        //sort planets based on population
        allPlanetsTempArray.sort((a,b) => a.population-b.population);
        //copy temp array data when all the values are fetched
        allPlanets = allPlanetsTempArray.slice();
        allPlanetsTempArray = [];
        // console.log("allPlanetsJson :: " + JSON.stringify(allPlanets.length));
      }
    });
}
