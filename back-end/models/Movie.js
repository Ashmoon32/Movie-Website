const { v4: uuidv4 } = require('uuid');
const JSONDatabase = require('../config/database');

class Movie {
  constructor() {
    this.db = new JSONDatabase('movies.json');
    this.initializeSampleData();
  }

  initializeSampleData() {
    const movies = this.db.findAll();
    if (movies.length === 0) {
      const sampleMovies = [
        {
          id: uuidv4(),
          title: "Inception",
          year: 2010,
          rating: 8.8,
          genre: ["Action", "Sci-Fi", "Thriller"],
          director: "Christopher Nolan",
          description: "A thief who steals corporate secrets through dream-sharing technology.",
          duration: 148,
          poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: "The Shawshank Redemption",
          year: 1994,
          rating: 9.3,
          genre: ["Drama"],
          director: "Frank Darabont",
          description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          duration: 142,
          poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: "The Dark Knight",
          year: 2008,
          rating: 9.0,
          genre: ["Action", "Crime", "Drama"],
          director: "Christopher Nolan",
          description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
          duration: 152,
          poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          createdAt: new Date().toISOString()
        }
      ];
      sampleMovies.forEach(movie => this.db.create(movie));
    }
  }

  getAll() {
    return this.db.findAll();
  }

  getById(id) {
    return this.db.findById(id);
  }

  create(movieData) {
    const movie = {
      id: uuidv4(),
      ...movieData,
      createdAt: new Date().toISOString(),
      rating: parseFloat(movieData.rating) || 0
    };
    return this.db.create(movie);
  }

  update(id, movieData) {
    return this.db.update(id, movieData);
  }

  delete(id) {
    return this.db.delete(id);
  }

  search(query) {
    const movies = this.db.findAll();
    const searchTerm = query.toLowerCase();
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.director.toLowerCase().includes(searchTerm) ||
      movie.genre.some(g => g.toLowerCase().includes(searchTerm))
    );
  }

  getByGenre(genre) {
    const movies = this.db.findAll();
    return movies.filter(movie => 
      movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }
}

module.exports = new Movie();