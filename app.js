require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const STORE = require('./movies-data-small.json');

const app = express();
app.use(morgan('dev'));
app.use(function validateBearerToken(req, res, next){
  const bearerToken = req.get('Authorization').split(' ')[1];
  const apiToken = process.env.API_TOKEN;
  if(!bearerToken || bearerToken !== apiToken) {
    return res.status(401).send('401: Unauthorized Request');
  }
  next();
})
app.use(cors());
app.use(helmet());

function handleGetMovie(req, res) {
  const { genre, country, avg_vote } = req.query;
  let response = STORE;

  if(genre) {
    const genreL = genre.toLowerCase();
    response = response.filter(movie => movie.genre.toLowerCase() === genreL);
  }

  if(country) {
    const countryL = country.toLowerCase().split('_').join('');
    response = response.filter(movie => movie.country.toLowerCase().split(' ').join('') === countryL);
  }

  if(avg_vote) {
    const avg_voteF = Number(avg_vote);
    response = response.filter(movie => Number(movie.avg_vote) >= avg_voteF);
  }
  
  res.json(response);
};

app.get('/movie', handleGetMovie);


module.exports = app;