const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// GET /api/favorites - Get user's favorites
router.get('/', favoriteController.getFavorites);

// POST /api/favorites - Add to favorites
router.post('/', favoriteController.addToFavorites);

// DELETE /api/favorites/:movieId - Remove from favorites
router.delete('/:movieId', favoriteController.removeFromFavorites);

// PUT /api/favorites/:movieId/notes - Update favorite notes
router.put('/:movieId/notes', favoriteController.updateFavoriteNotes);

// GET /api/favorites/check/:movieId - Check if movie is in favorites
router.get('/check/:movieId', favoriteController.checkIsFavorite);

module.exports = router;