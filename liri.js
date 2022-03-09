// read and set any environment variables with the dotenv package
require('dotenv').config();

// Require Axios for get requests
const axios = require('axios');

// require Spotify Package installed in npm
const Spotify = require('node-spotify-api');

// import momentJS to format dat/time
const moment = require('moment');

// import the keys.js file that holds SPOTIFY API info
const keys = require('./keys.js');

// access keys information
const spotify = new Spotify(keys.spotify);
const omdb = keys.omdb;
const bandsInTown = keys.bandsInTown;

// Spotify promise callback
const displaySpotify = (res) => {
  console.log('Artist(s): ', res.tracks.items[0].artists[0].name);
  console.log('Song Name: ', res.tracks.items[0].name);
  console.log('Preview Link: ', res.tracks.items[0].preview_url);
  console.log('Album Name: ', res.tracks.items[0].album.name);
};

const expr = process.argv.slice(2, 3).toString();
const song = process.argv.slice(3).join(' ').toString();
const band = process.argv.slice(3).join('').toString();
const movie = process.argv.slice(3).join('+').toString();

switch (expr) {
  // search Spotify
  case 'spotify-this-song':
    spotify
      .search({ type: 'track', query: song, limit: 1 })
      .then(displaySpotify)
      .catch((err) => console.log(new Error(err)));
    break;

  // search bands in town
  case 'concert-this':
    axios
      .get(
        `https://rest.bandsintown.com/artists/${band}/events?app_id=${bandsInTown}`
      )
      .then((res) => {
        // Handle Success
        return res.data;
      })
      .catch((err) => {
        // Handle err
        console.log(err);
      })
      // Do After
      .then((data) => {
        return data;
      })
      // Do After
      .then((events) => {
        events.forEach((event, i) => {
          console.log('-----------------------------------------');
          console.log('id: ', i);
          console.log('Venue Name: ', event.venue.name);
          console.log('Venue Location: ', event.venue.location);
          console.log(
            'Date/Time: ',
            moment(event.datetime).format('MM/DD/YYYY hh:mm:ss')
          );
        });
      });
    break;

  // search omdb
  case 'movie-this':
    axios
      .get(`http://www.omdbapi.com/?t=${movie}&apikey=${omdb}`)
      .then((res) => {
        // Handle Success
        return res.data;
      })
      .catch((err) => {
        // Handle err
        console.log(err);
      })
      // Do After
      .then((data) => {
        console.log(`
Title: ${data.Title}

Release year: ${data.Year}

Movie Ratings: 
  - imdbRating: ${data.imdbRating}
  - ${data.Ratings[0].Source}: ${data.Ratings[0].Value}
  - ${data.Ratings[1].Source}: ${data.Ratings[1].Value}

Country: ${data.Country}

Language: ${data.Language}

Plot: ${data.Plot}

Actors: ${data.Actors}`);
      });
    break;

  default:
    console.log(`Could not evaluate command: ${expr}`);
}
