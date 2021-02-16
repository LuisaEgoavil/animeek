const mongoose= require ('mongoose')
require('./User.model')

let AnimeSchema = new mongoose.Schema({
  title: String,
  image_url: String,
  synopsis: String,
  episodes: Number,
  score: Number,
  myUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  animeid: Number
});

let AnimeModel = mongoose.model('animeinfo', AnimeSchema)

module.exports = AnimeModel