console.log('API Key Loaded');
// exports.spotify = {
//   id: process.env.SPOTIFY_ID,
//   secret: process.env.SPOTIFY_SECRET,
// };
// exports.omdb = process.env.OMDB_ID;
let spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
};

let omdb = process.env.OMDB_ID;

let bandsInTown = process.env.BANDS_ID;
module.exports = { spotify, omdb };
