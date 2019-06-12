// uses the package to populate our process.env from a
// .env file * need to follow up on whether or not this
// should be saved as --save-dev vs regular install for
// production
require('dotenv').config();

// import express
const express = require('express');

// import a logger
const morgan = require('morgan');

// imports a package to help with overcoming cors 
// restrictions *  need to follow up if this is only
// to be saved for development or for production
const cors = require('cors');

// package to implement protecting our server from 
// malicious intent
const helmet = require('helmet');

// importing the sample data store to serve by our 
// application
const STORE = require('./movies-data-small.json');

// enable express
const app = express();

// use morgan in 'dev' mode
app.use(morgan('dev'));

// this validates our requests and requires users of 
// endpoint to present validation against our own token
app.use(function validateBearerToken(req, res, next){
  
  // this uses req.get() to access the value from the key
  // in the headers submitted
  const bearerToken = req.get('Authorization').split(' ')[1];
  const apiToken = process.env.API_TOKEN;
  if(!bearerToken || bearerToken !== apiToken) {
    return res.status(401).send('401: Unauthorized Request');
  }
  next();
})

// use the cors package
app.use(cors());

// use the helmet package
app.use(helmet());

// this handles sorting our requests that consumers of
// the api endpoint are going to interact with to filter
// the results and save bandwidth
function handleGetMovie(req, res) {

  // destructuring the query 
  // for some reason when genres is declared as
  // plural the query can be a genre to work
  // however, if declared as singular genre only
  // the param of plural genres works on the req
  // weird bug
  const { genres, country, avg_vote } = req.query;

  // setting the response to the database(json for 
  // this example)
  let response = STORE;

  // if query includes genres
  if(genres) {

    // make query lowercase
    const genresL = genres.toLowerCase();

    // set response to the store filtered and matched
    // to the query
    response = response.filter(movie => {
      movie.genres.toLowerCase() === genresL
    });
  }

  // logic for if query includes country
  if(country) {
    
    // format the country by splitting and normalizing
    // the string to be useful in filter
    const countryL = country.toLowerCase().split('_').join('');

    // filter the response object by the country
    response = response.filter(movie => movie.country.toLowerCase().split(' ').join('') === countryL);
  }

  // logic for if vote req is included
  if(avg_vote) {

    // parseFloat is a bit slower because it searches for 
    // first appearance of a number in a string, while the 
    // Number constuctor creates a new number instance 
    // from strings that contains numeric values with 
    // whitespace or that contains false values. +"" and 
    // Number("") returns 0, 
    // while parseFloat("") returns NaN
    const avg_voteF = Number(avg_vote);

    // filter the response by a number 
    // greater than or equal to the query
    response = response.filter(movie => {
      Number(movie.avg_vote) >= avg_voteF
    });
  }
  
  // return the response after any filtering
  res.json(response);
};

// creates the /movie endpoint and assigns
// sends the logic to the handleGetMovie function
app.get('/movie', handleGetMovie);

// exports the app to be imported by server
module.exports = app;