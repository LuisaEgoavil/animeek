const mongoose= require ('mongoose')

let AnimeSchema = new mongoose.Schema({
  title: String,
  image_url: String,
  synopsis: String,
  episodes: Number,
  score: Number
});

let AnimeModel = mongoose.model('animeinfo', AnimeSchema)

module.exports = AnimeModel