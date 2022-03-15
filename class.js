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

// goodbye message
const goodbyeMsg = `
                                    ----------------------------------------------------------------------------

                                    **** Thanks for using my CLI app :) I hope you enjoyed your experience! ****
    
                                    ----------------------------------------------------------------------------
`;
// lets start by making a spotify class
// what props will i need?
// which functions?

class SpotifyCommand {
  constructor( command, query){
    // this.api_key = api_key;
    this.command = command;
    this.query = query
  }

  
  async getSong() {
    // new spotify key
    const spotify = new Spotify(keys.spotify);

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

      // goodbye message
      console.log(goodbyeMsg);
    });
  }
}

// Switch to decide which code to execute
switch (command) {
  // search Spotify
  case 'spotify-this-song':
    const song = new SpotifyCommand(command, topic);

    song.getSong();
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