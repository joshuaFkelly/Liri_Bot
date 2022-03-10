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
const command = process.argv.slice(2, 3).toString();
const topic = process.argv.slice(3).join(' ').toString();

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
const spotifyThisSong = (topic) => {
  // new spotify key
  const spotify = new Spotify(keys.spotify);

  spotify
    // get request
    .search({ type: 'track', query: topic, limit: 50 })
    // response
    .then((res) => res)
    // error if bad response
    .catch((err) => console.log(new Error(err)))
    // parse through data
    .then((data) => data.tracks.items)
    // error if cannot find parsed data
    .catch((err) => console.log(new Error(err)))
    // display data
    .then(displaySpotify)
    // error if cannot display
    .catch((err) => console.log(new Error(err)));
};

// callback to display concert info
const displayConcert = (events) => {
  events.forEach((event, i) => {
    ({ eventName, eventLocation, dateTime } = {
      eventName: event.venue.name,
      eventLocation: event.venue.location,
      dateTime: event.datetime,
    });
    console.log(`      --------------------------------------------------------


      id: ${i}

      Venue Name: ${eventName}

      Venue Location: ${eventLocation}

      Date/Time: ${moment(dateTime).format('MM/DD/YYYY HH:mm:ss')}
    
    `);
  });
};

// api request to bands in town
const concertThis = (topic) => {
  axios
    // get request
    .get(
      `https://rest.bandsintown.com/artists/${topic}/events?app_id=${bandsInTown}`
    )
    // receive data
    .then((res) => res.data)
    // error if data not received
    .catch((err) => console.log(new Error(err)))
    // display data
    .then(displayConcert)
    // error if cannot display
    .catch((err) => console.log(new Error(err)));
};

// Callback to display movie info
const displayMovie = (data) => {
  ({ title, year, rating, country, language, plot, actors, ratings } = {
    title: data.Title,
    year: data.Year,
    rating: data.imdbRating,
    country: data.Country,
    language: data.Language,
    plot: data.Plot,
    actors: data.Actors,
    ratings: data.Ratings.map((rating) => {
      return `- ${rating.Source}: ${rating.Value}`;
    }).join(`
    `),
  });

  console.log(`
  --------------------------------------------------------

  Title: ${title}

  Release year: ${year}

  Movie Ratings:
    - imdbRating: ${rating}
    ${ratings} 

  Country: ${country}

  Language: ${language}

  Plot: ${plot}

  Actors: ${actors}
  `);
};

// api request to omdb
const movieThis = (topic) => {
  // get request
  axios
    .get(`http://www.omdbapi.com/?t=${topic}&apikey=${omdb}`)
    // response data
    .then((res) => res.data)
    // error if bad request
    .catch((err) => console.log(err))
    // display data
    .then(displayMovie)
    // error if cannot display data
    .catch((err) => console.log(new Error(err)));
};

// function for do-what-it-says command
const doWhatItSays = () => {
  fs.readFile('./random.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(new Error(err));
    }
    const randomTxt = data.split(':');
    const command = randomTxt[0];
    const topic = randomTxt[1];
    switch (command) {
      case 'spotify-this-song':
        spotifyThisSong(topic);
        break;
      case 'concert-this':
        concertThis(topic);
        break;
      case 'movie-this':
        movieThis(topic);
        break;
      default:
        console.log(`Could not evaluate command: ${command}`);
    }
  });
};

// Switch to decide which code to execute
switch (command) {
  // search Spotify
  case 'spotify-this-song':
    spotifyThisSong(topic);
    break;

  // search bands in town
  case 'concert-this':
    concertThis(topic);
    break;

  // search omdb
  case 'movie-this':
    movieThis(topic);
    break;

  // read command inside random.txt
  case 'do-what-it-says':
    doWhatItSays(topic);
    break;

  // If it all fucks up
  default:
    console.log(`Could not evaluate command: ${command}`);
}

// Log all the commands and their topics to this file
fs.appendFile(
  'log.txt',
  `${command}:${topic},
`,
  (err) => {
    if (err) {
      console.log(new Error(err));
    }
  }
);
