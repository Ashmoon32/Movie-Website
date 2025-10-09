const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let movies = [
    {id: 1, title: 'Inception, year: 2010', rating: 8.8 },
    {id: 2, title: 'The Dark Knight', year: 2008, rating: 9.0 },
    {id: 3, title: 'Interstellar', year: 2014, rating: 8.6 }
];

app.get('/', (req, res) => {
    res.json({message: "Movie API is working!"});
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:id' (req, res) => {
    const id = parseInt(req.params.id);
    const movie = movies.find(m =>.id === id);

    if(!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
});

app.post('/movies', (req, res) => {
    const { title, year, rating } => req.body;

    if(!title || !year) {
        return res.status(400).json({ message: 'Title and year are required' });
    }

    const newMovie = {
        id: movies.lenght + 1,
        title, 
        year: parseInt(year),
        rating: rating || 0
    };

    movies.push(newMovie);
    res.status(201).json(newMovie);
});