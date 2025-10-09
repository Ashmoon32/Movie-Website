const { v4: uuidv4 } = require('uuid');
const JSONDatabase = require('../config/database');
const movieModel = require('./Movie');

class Favorite {
  constructor() {
    this.db = new JSONDatabase('favorites.json');
  }

  getUserFavorites(userId) {
    const favorites = this.db.findByField('userId', userId);
    // Enrich with movie data
    return favorites.map(fav => {
      const movie = movieModel.getById(fav.movieId);
      return { ...fav, movie };
    }).filter(fav => fav.movie); // Remove favorites if movie doesn't exist
  }

  addFavorite(userId, movieId) {
    const existing = this.db.findAll().find(fav => 
      fav.userId === userId && fav.movieId === movieId
    );

    if (existing) {
      return { error: 'Movie already in favorites' };
    }

    const movie = movieModel.getById(movieId);
    if (!movie) {
      return { error: 'Movie not found' };
    }

    const favorite = {
      id: uuidv4(),
      userId,
      movieId,
      addedAt: new Date().toISOString(),
      notes: ''
    };

    return this.db.create(favorite);
  }

  removeFavorite(userId, movieId) {
    const favorites = this.db.findAll();
    const index = favorites.findIndex(fav => 
      fav.userId === userId && fav.movieId === movieId
    );

    if (index === -1) {
      return { error: 'Favorite not found' };
    }

    const deleted = favorites.splice(index, 1)[0];
    this.db.write(favorites);
    return deleted;
  }

  updateFavoriteNotes(userId, movieId, notes) {
    const favorites = this.db.findAll();
    const favorite = favorites.find(fav => 
      fav.userId === userId && fav.movieId === movieId
    );

    if (!favorite) {
      return { error: 'Favorite not found' };
    }

    favorite.notes = notes;
    this.db.write(favorites);
    return favorite;
  }

  isMovieInFavorites(userId, movieId) {
    const favorites = this.db.findAll();
    return favorites.some(fav => 
      fav.userId === userId && fav.movieId === movieId
    );
  }
}

module.exports = new Favorite();