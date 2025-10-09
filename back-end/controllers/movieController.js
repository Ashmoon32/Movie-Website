const movieModel = require('../models/Movie');

const movieController = {
  // Get all movies
  getAllMovies: (req, res) => {
    try {
      const movies = movieModel.getAll();
      res.json({
        success: true,
        count: movies.length,
        data: movies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching movies',
        error: error.message
      });
    }
  },

  // Get single movie
  getMovieById: (req, res) => {
    try {
      const movie = movieModel.getById(req.params.id);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }
      res.json({
        success: true,
        data: movie
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching movie',
        error: error.message
      });
    }
  },

  // Create new movie
  createMovie: (req, res) => {
    try {
      const { title, year, rating, genre, director, description, duration, poster } = req.body;

      // Validation
      if (!title || !year) {
        return res.status(400).json({
          success: false,
          message: 'Title and year are required'
        });
      }

      const movieData = {
        title,
        year: parseInt(year),
        rating: parseFloat(rating) || 0,
        genre: Array.isArray(genre) ? genre : [genre].filter(Boolean),
        director: director || 'Unknown',
        description: description || '',
        duration: duration ? parseInt(duration) : null,
        poster: poster || ''
      };

      const newMovie = movieModel.create(movieData);
      res.status(201).json({
        success: true,
        message: 'Movie created successfully',
        data: newMovie
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating movie',
        error: error.message
      });
    }
  },

  // Update movie
  updateMovie: (req, res) => {
    try {
      const movie = movieModel.getById(req.params.id);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      const updatedMovie = movieModel.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Movie updated successfully',
        data: updatedMovie
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating movie',
        error: error.message
      });
    }
  },

  // Delete movie
  deleteMovie: (req, res) => {
    try {
      const movie = movieModel.getById(req.params.id);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      movieModel.delete(req.params.id);
      res.json({
        success: true,
        message: 'Movie deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting movie',
        error: error.message
      });
    }
  },

  // Search movies
  searchMovies: (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const results = movieModel.search(q);
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching movies',
        error: error.message
      });
    }
  },

  // Get movies by genre
  getMoviesByGenre: (req, res) => {
    try {
      const { genre } = req.params;
      const movies = movieModel.getByGenre(genre);
      res.json({
        success: true,
        count: movies.length,
        data: movies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching movies by genre',
        error: error.message
      });
    }
  }
};

module.exports = movieController;