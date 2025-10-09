# Movie App Backend API

A complete backend for movie application with favorites functionality.

## Features

- **Movie CRUD Operations**
- **Favorites Management**
- **Search Movies**
- **Genre Filtering**
- **Favorite Notes**

## API Endpoints

### Movies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all movies |
| GET | `/api/movies/:id` | Get single movie |
| POST | `/api/movies` | Create new movie |
| PUT | `/api/movies/:id` | Update movie |
| DELETE | `/api/movies/:id` | Delete movie |
| GET | `/api/movies/search?q=query` | Search movies |
| GET | `/api/movies/genre/:genre` | Get movies by genre |

### Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user's favorites |
| POST | `/api/favorites` | Add to favorites |
| DELETE | `/api/favorites/:movieId` | Remove from favorites |
| PUT | `/api/favorites/:movieId/notes` | Update favorite notes |
| GET | `/api/favorites/check/:movieId` | Check if movie is favorite |

## Sample Requests

### Create Movie
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Matrix",
    "year": 1999,
    "rating": 8.7,
    "genre": ["Action", "Sci-Fi"],
    "director": "Lana Wachowski, Lilly Wachowski",
    "description": "A computer hacker learns from mysterious rebels about the true nature of his reality.",
    "duration": 136
  }'