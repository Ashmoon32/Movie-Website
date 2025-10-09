// API endpoints - now pointing to YOUR backend
const APILINK = 'http://localhost:3001/api/movies';
const FAVORITES_LINK = 'http://localhost:3001/api/favorites';

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

// Global variables
let allMovies = [];
let favorites = [];

// Load movies when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    loadFavorites();
});

// Load all movies
function loadMovies() {
    fetch(APILINK)
        .then(res => {
            if (!res.ok) {
                throw new Error('Backend server not running');
            }
            return res.json();
        })
        .then(function(data) {
            if (data.success) {
                allMovies = data.data;
                displayMovies(allMovies);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            main.innerHTML = `
                <div style="color: white; text-align: center; padding: 50px;">
                    <h3>Backend Server Not Running</h3>
                    <p>Please start the backend server first:</p>
                    <p><strong>cd backend</strong></p>
                    <p><strong>npm run dev</strong></p>
                    <p>Then refresh this page.</p>
                </div>
            `;
        });
}

// Load user favorites
function loadFavorites() {
    fetch(FAVORITES_LINK)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                favorites = data.data;
                updateFavoriteButtons();
            }
        })
        .catch(error => {
            console.error('Error loading favorites:', error);
        });
}

// Display movies
function displayMovies(movies) {
    main.innerHTML = '';
    
    if (movies.length === 0) {
        main.innerHTML = '<p style="color: white; text-align: center;">No movies found</p>';
        return;
    }
    
    movies.forEach(movie => {
        const isFavorite = favorites.some(fav => fav.movieId === movie.id);
        
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'card');
        
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');
        
        const div_column = document.createElement('div');
        div_column.setAttribute('class', 'column');
        
        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        image.src = movie.poster || './placeholder.jpg';
        image.alt = movie.title;
        image.onerror = function() {
            this.src = './placeholder.jpg';
        }
        
        const title = document.createElement('h3');
        const year = document.createElement('p');
        const rating = document.createElement('p');
        const genre = document.createElement('p');
        const director = document.createElement('p');
        
        title.innerHTML = `${movie.title}`;
        year.innerHTML = `Year: ${movie.year}`;
        rating.innerHTML = `Rating: ${movie.rating}`;
        genre.innerHTML = `Genre: ${movie.genre.join(', ')}`;
        director.innerHTML = `Director: ${movie.director}`;
        
        // Favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `favorite-btn ${isFavorite ? 'favorited' : ''}`;
        favoriteBtn.innerHTML = isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites';
        favoriteBtn.setAttribute('data-movie-id', movie.id);
        
        favoriteBtn.addEventListener('click', function() {
            toggleFavorite(movie.id, this);
        });
        
        // Style the elements
        title.style.color = 'white';
        year.style.color = '#cccccc';
        rating.style.color = '#cccccc';
        genre.style.color = '#cccccc';
        director.style.color = '#cccccc';
        genre.style.fontSize = '0.9em';
        director.style.fontSize = '0.9em';
        
        const center = document.createElement('center');
        center.appendChild(image);
        center.appendChild(favoriteBtn);
        
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_card.appendChild(year);
        div_card.appendChild(rating);
        div_card.appendChild(genre);
        div_card.appendChild(director);
        
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);
        main.appendChild(div_row);
    });
}

// Toggle favorite status
function toggleFavorite(movieId, button) {
    const isCurrentlyFavorite = button.classList.contains('favorited');
    
    if (isCurrentlyFavorite) {
        // Remove from favorites
        fetch(`${FAVORITES_LINK}/${movieId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                button.classList.remove('favorited');
                button.innerHTML = '♡ Add to Favorites';
                loadFavorites(); // Reload favorites
            }
        })
        .catch(error => {
            console.error('Error removing favorite:', error);
            alert('Error removing from favorites');
        });
    } else {
        // Add to favorites
        fetch(FAVORITES_LINK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId: movieId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                button.classList.add('favorited');
                button.innerHTML = '♥ Remove from Favorites';
                loadFavorites(); // Reload favorites
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error adding favorite:', error);
            alert('Error adding to favorites');
        });
    }
}

// Update all favorite buttons based on current favorites
function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const movieId = btn.getAttribute('data-movie-id');
        const isFavorite = favorites.some(fav => fav.movieId === movieId);
        
        if (isFavorite) {
            btn.classList.add('favorited');
            btn.innerHTML = '♥ Remove from Favorites';
        } else {
            btn.classList.remove('favorited');
            btn.innerHTML = '♡ Add to Favorites';
        }
    });
}

// Search functionality
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const searchItem = search.value.trim();
    
    if (searchItem) {
        // Use backend search endpoint
        fetch(`${APILINK}/search?q=${encodeURIComponent(searchItem)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    displayMovies(data.data);
                }
            })
            .catch(error => {
                console.error('Search error:', error);
                // Fallback to client-side search
                const filtered = allMovies.filter(movie => 
                    movie.title.toLowerCase().includes(searchItem.toLowerCase()) ||
                    movie.director.toLowerCase().includes(searchItem.toLowerCase()) ||
                    movie.genre.some(g => g.toLowerCase().includes(searchItem.toLowerCase()))
                );
                displayMovies(filtered);
            });
    } else {
        // If search is empty, show all movies
        displayMovies(allMovies);
    }
    search.value = "";
});

// Add movie form (optional - for testing)
function addMovieFormToPage() {
    const formHTML = `
        <div style="padding: 20px; background-color: #151f30; margin: 20px; border-radius: 10px;">
            <h3 style="color: white; margin-bottom: 15px;">Add New Movie (Testing)</h3>
            <form id="addMovieForm">
                <input type="text" id="movieTitle" placeholder="Movie Title" required 
                       style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #2a3d5f;">
                <input type="number" id="movieYear" placeholder="Release Year" required 
                       style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #2a3d5f;">
                <input type="number" id="movieRating" placeholder="Rating" step="0.1" 
                       style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #2a3d5f;">
                <input type="text" id="movieGenre" placeholder="Genre (comma separated)" 
                       style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #2a3d5f;">
                <input type="text" id="movieDirector" placeholder="Director" 
                       style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #2a3d5f;">
                <textarea id="movieDescription" placeholder="Description" 
                          style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #2a3d5f; height: 60px;"></textarea>
                <input type="text" id="moviePoster" placeholder="Poster URL (optional)" 
                       style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #2a3d5f;">
                <button type="submit" 
                        style="width: 100%; padding: 10px; margin: 5px 0; background-color: #1e88e5; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Add Movie
                </button>
            </form>
        </div>
    `;
    
    const existingForm = document.getElementById('addMovieFormContainer');
    if (!existingForm) {
        const container = document.createElement('div');
        container.id = 'addMovieFormContainer';
        container.innerHTML = formHTML;
        document.body.insertBefore(container, document.querySelector('script'));
        
        // Add form handler
        document.getElementById('addMovieForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('movieTitle').value;
            const year = document.getElementById('movieYear').value;
            const rating = document.getElementById('movieRating').value;
            const genre = document.getElementById('movieGenre').value;
            const director = document.getElementById('movieDirector').value;
            const description = document.getElementById('movieDescription').value;
            const poster = document.getElementById('moviePoster').value;
            
            const movieData = {
                title: title,
                year: parseInt(year),
                rating: parseFloat(rating) || 0,
                genre: genre ? genre.split(',').map(g => g.trim()) : [],
                director: director || 'Unknown',
                description: description || '',
                poster: poster || ''
            };
            
            fetch(APILINK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Movie added successfully!');
                    document.getElementById('addMovieForm').reset();
                    loadMovies(); // Refresh the movie list
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding movie');
            });
        });
    }
}

// Add the form to page after load
setTimeout(addMovieFormToPage, 1000);