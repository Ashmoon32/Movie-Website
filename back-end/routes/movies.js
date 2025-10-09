const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// GET /api/movies - Get all movies
router.get('/', movieController.getAllMovies);

// GET /api/movies/search - Search movies
router.get('/search', movieController.searchMovies);

// GET /api/movies/genre/:genre - Get movies by genre
router.get('/genre/:genre', movieController.getMoviesByGenre);

// GET /api/movies/:id - Get single movie
router.get('/:id', movieController.getMovieById);

// POST /api/movies - Create new movie
router.post('/', movieController.createMovie);

// PUT /api/movies/:id - Update movie
router.put('/:id', movieController.updateMovie);

// DELETE /api/movies/:id - Delete movie
router.delete('/:id', movieController.deleteMovie);

module.exports = router;