// read and set any environment variables with the dotenv package
require('dotenv').config();
const Spotify = require('node-spotify-api');
const axios = require('axios');
// import the keys.js file
const keys = require('./keys.js');

// access keys information
const spotify = new Spotify(keys.spotify);

spotify
  .search({ type: 'track', query: 'Best Day Ever', limit: 1 })
  .then((res) => console.log(res))
  .catch((err) => new Error(err));
// command for bands in town
// node liri.js concert-this <artist/band name here>

// url for bands in town
// https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp

// url for spotify
