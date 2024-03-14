var movieHost = "https://localhost:7034/api/movies";

document.addEventListener('DOMContentLoaded', function () {
    fetchMovies();
    setupEventListeners();
});

document.getElementById('save-movie-changes').addEventListener('click', updateMovie);

function fetchMovies() {
    fetch(movieHost)
        .then(response => response.json())
        .then(movies => {
            populateMovieDropdown(movies);
            populateMoviesTable(movies);
        })
        .catch(error => console.error("Error fetching movies:", error));
}

function populateMovieDropdown(movies) {
    const dropdown = document.getElementById('movie-dropdown');
    dropdown.innerHTML = '<option value="">Select a movie...</option>';
    movies.forEach(movie => {
        let option = new Option(movie.title, movie.id);
        dropdown.appendChild(option);
    });
}

function populateMoviesTable(movies) {
    const tableBody = document.getElementById('all-movies-table-body');
    tableBody.innerHTML = '';
    movies.forEach((movie, index) => {
        let row = tableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${movie.title}</td>
            <td>${movie.releaseYear}</td>
            <td>
                <button class="btn btn-warning" onclick="showEditMovieModal(${movie.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteMovie(${movie.id})">Delete</button>
            </td>
        `;
    });
}

function setupEventListeners() {
    document.getElementById('add-movie-form').addEventListener('submit', addMovie);
    document.getElementById('movie-dropdown').addEventListener('change', function () {
        const movieId = this.value;
        if (movieId) {
            displayMovieDetails(movieId);
        }
    });
}

function addMovie(e) {
    e.preventDefault();
    const title = document.getElementById('movie-title').value;
    const releaseYear = document.getElementById('movie-release-year').value;

    fetch(movieHost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, releaseYear: parseInt(releaseYear, 10) })
    })
        .then(response => response.json())
        .then(() => {
            fetchMovies(); // Refresh the movies list and dropdown
            document.getElementById('add-movie-form').reset(); // Clear the form
        })
        .catch(error => console.error("Error adding movie:", error));
}

function displayMovieDetails(movieId) {
    fetch(`${movieHost}/${movieId}`)
        .then(response => {
            if (!response.ok) throw new Error(`Movie not found: ${response.statusText}`);
            return response.json();
        })
        .then(movie => {
            const detailsDiv = document.getElementById('movie-details');
            detailsDiv.innerHTML = `
                <h4>${movie.title}</h4>
                <p>Release Year: ${movie.releaseYear}</p>
            `;
        })
        .catch(error => console.error("Error fetching movie:", error));
}

function showEditMovieModal(movieId) {
    fetch(`${movieHost}/${movieId}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch movie details');
            return response.json();
        })
        .then(movie => {
            document.getElementById('edit-movie-id').value = movie.id;
            document.getElementById('edit-movie-title').value = movie.title;
            document.getElementById('edit-movie-release-year').value = movie.releaseYear;
            $('#editMovieModal').modal('show');
        })
        .catch(error => console.error("Error loading movie for edit:", error));
}

function updateMovie() {
    const id = document.getElementById('edit-movie-id').value;
    const updatedMovie = {
        id: parseInt(id, 10),
        title: document.getElementById('edit-movie-title').value,
        releaseYear: parseInt(document.getElementById('edit-movie-release-year').value, 10)
    };

    fetch(`${movieHost}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
    })
        .then(response => response.json())
        .then(() => {
            $('#editMovieModal').modal('hide');
            fetchMovies();
        })
        .catch(error => {
            console.error("Error updating movie:", error);
            alert(`Error updating movie: ${error}`);
        });
}

function deleteMovie(movieId) {
    if (confirm('Are you sure you want to delete this movie?')) {
        fetch(`${movieHost}/${movieId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete movie');
                fetchMovies(); // Refresh the movies list
            })
            .catch(error => console.error("Error deleting movie:", error));
    }
}
