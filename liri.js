// read and set any environment variables with the dotenv package
require('dotenv').config();
const axios = require('axios');
// require Spotify Package installed in npm
const Spotify = require('node-spotify-api');
// import momentJS to format dat/time
const moment = require('moment');
// import the keys.js file that holds SPOTIFY API info
const keys = require('./keys.js');

// access keys information
const spotify = new Spotify(keys.spotify);

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
console.log(band);

switch (expr) {
  case 'spotify-this-song':
    // search Spotify
    spotify
      .search({ type: 'track', query: song, limit: 1 })
      .then(displaySpotify)
      .catch((err) => console.log(new Error(err)));
    break;
  case 'concert-this':
    axios
      .get(
        `https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`
      )
      .then((res) => {
        // handle success
        return res.data;
      })
      .catch((err) => {
        // handle err
        console.log(err);
      })
      .then((data) => {
        return data;
      })
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
  default:
    console.log(`Could not evaluate command: ${expr}`);
}
