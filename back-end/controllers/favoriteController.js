const favoriteModel = require('../models/Favorite');

// For simplicity, we'll use a static user ID. In real app, this would come from authentication.
const DEFAULT_USER_ID = 'user-123';

const favoriteController = {
  // Get user's favorites
  getFavorites: (req, res) => {
    try {
      const favorites = favoriteModel.getUserFavorites(DEFAULT_USER_ID);
      res.json({
        success: true,
        count: favorites.length,
        data: favorites
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching favorites',
        error: error.message
      });
    }
  },

  // Add to favorites
  addToFavorites: (req, res) => {
    try {
      const { movieId } = req.body;
      
      if (!movieId) {
        return res.status(400).json({
          success: false,
          message: 'Movie ID is required'
        });
      }

      const result = favoriteModel.addFavorite(DEFAULT_USER_ID, movieId);
      
      if (result.error) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Movie added to favorites',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding to favorites',
        error: error.message
      });
    }
  },

  // Remove from favorites
  removeFromFavorites: (req, res) => {
    try {
      const { movieId } = req.params;
      
      const result = favoriteModel.removeFavorite(DEFAULT_USER_ID, movieId);
      
      if (result.error) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.json({
        success: true,
        message: 'Movie removed from favorites',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error removing from favorites',
        error: error.message
      });
    }
  },

  // Update favorite notes
  updateFavoriteNotes: (req, res) => {
    try {
      const { movieId } = req.params;
      const { notes } = req.body;
      
      const result = favoriteModel.updateFavoriteNotes(DEFAULT_USER_ID, movieId, notes || '');
      
      if (result.error) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.json({
        success: true,
        message: 'Favorite notes updated',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating favorite notes',
        error: error.message
      });
    }
  },

  // Check if movie is in favorites
  checkIsFavorite: (req, res) => {
    try {
      const { movieId } = req.params;
      const isFavorite = favoriteModel.isMovieInFavorites(DEFAULT_USER_ID, movieId);
      
      res.json({
        success: true,
        data: { isFavorite }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking favorite status',
        error: error.message
      });
    }
  }
};

module.exports = favoriteController;