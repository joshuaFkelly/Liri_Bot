console.log('API Key Loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
};

exports.bandsInTown = {
  id: process.env.APP_ID,
};
