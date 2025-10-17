// script1.js (replace your current file or merge)
const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7d557966d152504b08f657ff6f80aeaa&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w300';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=7d557966d152504b08f657ff6f80aeaa&query=';

// Backend base URL (where your server runs)
const BACKEND = 'http://localhost:3000';

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

let favoriteIds = new Set(); // keep track of favorites returned from backend

// Fetch favorites from backend (to mark existing favorites)
async function loadFavorites() {
  try {
    const res = await fetch(`${BACKEND}/favorites`);
    if (!res.ok) throw new Error('Failed to load favorites');
    const favs = await res.json();
    favoriteIds = new Set(favs.map(f => f.id));
  } catch (err) {
    console.warn('Could not load favorites:', err);
    favoriteIds = new Set();
  }
}

// Render movies to DOM
function renderMovies(movies) {
  main.innerHTML = '';
  movies.forEach(movie => {
    const div_card = document.createElement('div');
    div_card.className = 'card';

    const center = document.createElement('center');

    const image = document.createElement('img');
    image.className = 'thumbnail';
    image.src = movie.poster_path ? (IMG_PATH + movie.poster_path) : './placeholder.jpg';

    const title = document.createElement('h3');
    title.textContent = movie.title;

    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-btn';
    favBtn.textContent = favoriteIds.has(movie.id) ? 'Favorited' : 'Favorite';
    if (favoriteIds.has(movie.id)) favBtn.classList.add('favorited');

    favBtn.addEventListener('click', () => handleFavoriteClick(movie, favBtn));

    center.appendChild(image);
    div_card.appendChild(center);
    div_card.appendChild(title);
    div_card.appendChild(favBtn);

    const column = document.createElement('div');
    column.className = 'column';
    column.appendChild(div_card);

    const row = document.createElement('div');
    row.className = 'row';
    row.appendChild(column);

    main.appendChild(row);
  });
}

// Handle favorite button click
async function handleFavoriteClick(movie, btn) {
  // If already favorited, optionally send DELETE to remove
  if (favoriteIds.has(movie.id)) {
    // remove favorite (optimistic UI)
    try {
      const res = await fetch(`${BACKEND}/favorites/${movie.id}`, { method: 'DELETE' });
      if (res.ok) {
        favoriteIds.delete(movie.id);
        btn.classList.remove('favorited');
        btn.textContent = 'Favorite';
      } else {
        const json = await res.json();
        console.warn('Remove failed', json);
      }
    } catch (err) {
      console.warn('Remove error', err);
    }
    return;
  }

  // If not favorited, POST to backend
  const payload = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path || '',
    year: movie.release_date ? Number(movie.release_date.slice(0,4)) : (movie.year || null)
  };

  try {
    const res = await fetch(`${BACKEND}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      favoriteIds.add(movie.id);
      btn.classList.add('favorited');
      btn.textContent = 'Favorited';
    } else {
      console.warn('Failed to favorite:', data);
    }
  } catch (err) {
    console.warn('Network error favoriting:', err);
  }
}

// Fetch movies from TMDB and render
async function returnMovies(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    await loadFavorites();           // get existing favorites first
    renderMovies(data.results);
  } catch (err) {
    console.error('Error fetching movies:', err);
  }
}

// Search form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchItem = search.value.trim();
  if (searchItem) {
    returnMovies(SEARCHAPI + encodeURIComponent(searchItem));
    search.value = "";
  }
});

// Initial load
returnMovies(APILINK);
