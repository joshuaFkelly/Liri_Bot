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

// argument variables from command line
const command = process.argv.slice(2, 3).toString();
const topic = process.argv.slice(3).join(' ').toString();


// lets start by making a spotify class
// what props will i need?
// which functions?

class Request {
  constructor(command, query) {
    this.command = command;
    this.query = query
  }

  // goodbye message
  goodbyeMsg = () => {
    console.log(`
                                    ----------------------------------------------------------------------------

                                    **** Thanks for using my CLI app :) I hope you enjoyed your experience! ****
    
                                    ----------------------------------------------------------------------------
`);
  }
}


class SpotifyCommand extends Request {
  constructor(api_key, command, query, goodbyeMsg) {
    super(command, query, goodbyeMsg)
    this.api_key = api_key
  }


  async spotifyThis() {

    // new spotify key
    const spotify = new Spotify(this.api_key);

    // response data
    const res = await spotify.search({
      type: 'track',
      query: this.query,
      limit: 50,
    });

    // songs data
    const songs = await res.tracks.items;
    // console.log(songs);
    songs.filter((song, i) => {
      this.id = i + 1;
      this.songName = song.name;
      this.artists = song.artists.map((artist) => artist.name).join(', ');
      this.albumName = song.album.name;
      this.previewUrl = song.preview_url;

      if (this.previewUrl === null) {
        this.previewUrl = 'No Preview';
      }

      console.log(`
        -------------------------------------------------------------------------------------------------------------------------

        ${this.id}

        Song Name: ${this.songName}

        Artist(s): ${this.artists}

        Album Name: ${this.albumName}

        Preview Link: ${this.previewUrl}
      `);

    });
    // goodbye messageß
    this.goodbyeMsg()
  }
}



class BandsInTownCommand extends Request{
  constructor(api_key, command, query) {
    super(command, query, goodbyeMsg)
    this.api_key = api_key;
  }

  // api request to bands in town
  concertThis = async () => {

    // response data
    const res = await axios.get(
      `https://rest.bandsintown.com/artists/${this.query}/events?app_id=${this.api_key}`
    );

    // event data
    const events = await res.data;


    // display data 
    events.forEach((event, i) => {

      this.id = i + 1
      this.eventName = event.venue.name;
      this.eventLocation = event.venue.location;
      this.dateTime = event.dateTime

      console.log(`      
      --------------------------------------------------------

      
      id: ${this.id}

      Venue Name: ${this.eventName}

      Venue Location: ${this.eventLocation}

      Date/Time: ${moment(this.dateTime).format('MM/DD/YYYY HH:mm:ss')}
    `);
    });
    this.goodbyeMsg()
  };
}


class OMDBCommand extends Request{
  constructor(api_key, command, query, goodbyeMsg) {
    super(command, query)
    this.api_key = api_key;
    this.goodbyeMsg = goodbyeMsg
  }


  // api request to omdb
  movieThis = async () => {
    // response data
    const res = await axios.get(
      `http://www.omdbapi.com/?t=${this.query}&apikey=${this.api_key}`
    );

    // movie data
    const movie = await res.data;

    this.title = movie.Title;
    this.year = movie.Year;
    this.rating = movie.imdbRating;
    this.country = movie.Country;
    this.language = movie.Language;
    this.plot = movie.Plot;
    this.actors = movie.Actors;
    this.ratings = movie.Ratings.map((rating) => {
      return `- ${rating.Source}: ${rating.Value}`;
    }).join(`
  `),

      console.log(`
  -----------------------------------------------------------------------------------------------------------------------------------------------

  Title: ${this.title}

  Release year: ${this.year}

  Movie Ratings:
    - imdbRating: ${this.rating}
    ${this.ratings} 

  Country: ${this.country}

  Language: ${this.language}

  Plot: ${this.plot}

  Actors: ${this.actors}
  
  -----------------------------------------------------------------------------------------------------------------------------------------------
  
  ${this.goodbyeMsg()}
  
  `);
  };

};



// Switch to decide which code to execute
switch (command) {

  // search Spotify
  case 'spotify-this-song':
    const song = new SpotifyCommand(keys.spotify, command, topic);
    song.spotifyThis();
    break;

  // search bands in town
  case 'concert-this':
    const concert = new BandsInTownCommand(keys.bandsInTown, command, topic)
    concert.concertThis()
    break;

  // search omdb
  case 'movie-this':
    const movie = new OMDBCommand(keys.omdb, command, topic)
    movie.movieThis()
    break;

  // If it all fucks up
  default:
    console.log(`Could not evaluate command: ${command}`);
}

