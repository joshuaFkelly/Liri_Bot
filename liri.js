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

// access keys information
const omdb = keys.omdb;
const bandsInTown = keys.bandsInTown;

// argument variables from command line
const expr = process.argv.slice(2, 3).toString();
const topic = process.argv.slice(3).join(' ').toString();

// callback to display concert info
const displayConcert = (events) => {
  events.forEach((event, i) => {
    console.log(`      --------------------------------------------------------


      id: ${i}

      Venue Name: ${event.venue.name}

      Venue Location: ${event.venue.location}

      Date/Time: ${moment(event.datetime).format('MM/DD/YYYY hh:mm:ss')}
    
    `);
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

// callback for Spotify api req
const displaySpotify = (songs) => {
  return songs.filter((song, i) => {
    ({ songName, artists, previewUrl, albumName } = {
      songName: song.name,
      artists: song.artists.map((artist) => artist.name).join(', '),
      previewUrl: song.preview_url,
      albumName: song.album.name,
    });

    if (previewUrl === null) {
      previewUrl = 'No Preview';
    }

    console.log(`
      -------------------------------------------------------------------------------------------------------------------------
            
      ${i + 1}


      Song Name: ${songName}

      Artist(s): ${artists}

      Album Name: ${albumName}

      Preview Link: ${previewUrl}
    `);
  });
};

// api request to spotify
const spotifyThisSong = () => {
  const spotify = new Spotify(keys.spotify);

  spotify
    .search({ type: 'track', query: topic, limit: 50 })
    .then((res) => res)
    .catch((err) => console.log(new Error(err)))
    .then((data) => data.tracks.items)
    .catch((err) => console.log(new Error(err)))
    .then(displaySpotify);
};

// Switch to decide which code to execute
switch (expr) {
  // search Spotify
  case 'spotify-this-song':
    spotifyThisSong();
    break;

  // search bands in town
  case 'concert-this':
    axios
      .get(
        `https://rest.bandsintown.com/artists/${topic}/events?app_id=${bandsInTown}`
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
      .get(`http://www.omdbapi.com/?t=${topic}&apikey=${omdb}`)
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

  // use command inside random.txt
  case 'do-what-it-says':
    fs.readFile('./random.txt', 'utf-8', (err, data) => {
      if (err) {
        console.log(new Error(err));
      }
      const randomTxt = data.split(',');
      const randomCommand = randomTxt[0];
      const topic = randomTxt[1];

      switch (randomCommand) {
        // search Spotify
        case 'spotify-this-song':
          spotify
            .search({ type: 'track', query: topic, limit: 1 })
            .then((res) => res.tracks.items[0])
            .catch((err) => console.log(new Error(err)))
            .then(displaySpotify);
          break;

        // search bands in town
        case 'concert-this':
          axios
            .get(
              `https://rest.bandsintown.com/artists/${topic}/events?app_id=${bandsInTown}`
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
            .get(`http://www.omdbapi.com/?t=${topic}&apikey=${omdb}`)
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

        default:
          console.log(`Could not evaluate command: ${expr}`);
      }
    });
    break;

  // If it all fucks up
  default:
    console.log(`Could not evaluate command: ${expr}`);
}

fs.appendFile('log.txt', `${expr},${topic}`, (err) => {
  if (err) {
    console.log(new Error(err));
  }
});
