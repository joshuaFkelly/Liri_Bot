// read and set any environment variables with the dotenv package
require('dotenv').config();

// import fs package to read random.txt
const fs = require('fs');
// import Axios for get requests
const axios = require('axios');

// import Spotify Package installed in npm
const Spotify = require('node-spotify-api');

// import momentJS to format dat/time
const moment = require('moment');

// import the keys.js file that holds SPOTIFY API info
const keys = require('./keys.js');
const exp = require('constants');

// access keys information
const spotify = new Spotify(keys.spotify);
const omdb = keys.omdb;
const bandsInTown = keys.bandsInTown;

// callback to display spotify info
const displaySpotify = (data) => {
  console.log(`
Artist(s): ${data.artists[0].name}

Song Name: ${data.name}

Preview Link: ${data.preview_url}

Album Name: ${data.album.name}
  `);
};

// callback to display concert info
const displayConcert = (events) => {
  events.forEach((event, i) => {
    console.log(`
---------------------------------------------------------
id: ${i}

Venue Name: ${event.venue.name}

Venue Location: ${event.venue.location}

Date/Time: ${moment(event.datetime).format('MM/DD/YYYY hh:mm:ss')}`);
  });
};

// Callback to display movie info
const displayMovie = (data) => {
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
};

// argument variables from command line
const expr = process.argv.slice(2, 3).toString();
const song = process.argv.slice(3).join(' ').toString();
const band = process.argv.slice(3).join('').toString();
const movie = process.argv.slice(3).join('+').toString();

switch (expr) {
  // search Spotify
  case 'spotify-this-song':
    spotify
      .search({ type: 'track', query: song, limit: 1 })
      .then((res) => res.tracks.items[0])
      .catch((err) => console.log(new Error(err)))
      .then(displaySpotify);
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
      .then(displayConcert);
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
      .then(displayMovie);
    break;

  case 'do-what-it-says':
    fs.readFile('./random.txt', 'utf-8', (err, data) => {
      if (err) {
        console.log(new Error(err));
      }
      console.log(data);
      const randomTxt = data.split(',');
      const randomCommand = randomTxt[0];
      const randomValue = randomTxt[1];
      console.log('Command: ', randomCommand);
      console.log('Value: ', randomValue);
    });
    break;
  default:
    console.log(`Could not evaluate command: ${expr}`);
}
