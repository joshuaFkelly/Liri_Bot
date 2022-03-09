// read and set any environment variables with the dotenv package
require('dotenv').config();
const axios = require('axios');
// require Spotify Package installed in npm
const Spotify = require('node-spotify-api');

// import the keys.js file that holds SPOTIFY API info
const keys = require('./keys.js');

// access keys information
const spotify = new Spotify(keys.spotify);
const concertAPIkey = keys.bandsInTown;
// Spotify promise callback
const displaySpotify = (res) => {
  console.log('Artist(s): ', res.tracks.items[0].artists[0].name);
  console.log('Song Name: ', res.tracks.items[0].name);
  console.log('Preview Link: ', res.tracks.items[0].preview_url);
  console.log('Album Name: ', res.tracks.items[0].album.name);
};

const expr = process.argv.slice(2, 3).toString();
const query = process.argv.slice(3).join(' ').toString();
switch (expr) {
  case 'spotify-this-song':
    // search Spotify
    spotify
      .search({ type: 'track', query: query, limit: 1 })
      .then(displaySpotify)
      .catch((err) => console.log(new Error(err)));
    break;
  case 'concert-this':
    axios
      .get(
        `https://rest.bandsintown.com/artists/${query}/events?${concertAPIkey}`
      )
      .then((res) => {
        // handle success
        console.log(res);
      })
      .catch((err) => {
        // handle err
        console.log(err);
      });

    break;
  default:
    console.log(`Could not evaluate command: ${expr}`);
}
