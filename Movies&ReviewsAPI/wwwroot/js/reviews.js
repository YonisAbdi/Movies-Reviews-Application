// Replace with the actual host of your reviews API
var reviewHost = "https://localhost:7034/api/reviews";

document.addEventListener('DOMContentLoaded', function () {
    fetchReviews();
    setupEventListeners();
});

document.getElementById('save-review-changes').addEventListener('click', updateReview);

// Fetch all reviews and populate the table and dropdown
function fetchReviews() {
    fetch(reviewHost)
        .then(response => response.json())
        .then(reviews => {
            populateReviewDropdown(reviews);
            populateReviewsTable(reviews);
        })
        .catch(error => console.error("Error fetching reviews:", error));
}

// Populate dropdown with review options
function populateReviewDropdown(reviews) {
    const dropdown = document.getElementById('review-dropdown');
    dropdown.innerHTML = '<option value="">Select a review...</option>';
    reviews.forEach(review => {
        let option = new Option(`Review for Movie ID ${review.movieId} - ${review.comment.substring(0, 20)}...`, review.id);
        dropdown.appendChild(option);
    });
}

// Populate reviews table
function populateReviewsTable(reviews) {
    const tableBody = document.getElementById('all-reviews-table-body');
    tableBody.innerHTML = '';
    reviews.forEach((review, index) => {
        let row = tableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${review.movieId}</td>
            <td>${review.rating}</td>
            <td>${review.comment}</td>
            <td>
                <button class="btn btn-warning" onclick="showEditReviewModal(${review.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteReview(${review.id})">Delete</button>
            </td>
        `;
    });
}

// Add event listeners for form submissions and dropdown changes
function setupEventListeners() {
    document.getElementById('add-review-form').addEventListener('submit', addReview);

    document.getElementById('review-dropdown').addEventListener('change', function () {
        const reviewId = this.value;
        if (reviewId) {
            displayReviewDetails(reviewId);
        }
    });
}

// Handle add review form submission
function addReview(e) {
    e.preventDefault();
    const movieId = document.getElementById('review-movie-id').value;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    fetch(reviewHost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: parseInt(movieId, 10), rating, comment })
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update review');
            return response.json();
        })
        .then(() => {
            $('#editReviewModal').modal('hide'); // Replace with your modal hide logic
            fetchReviews(); // Refresh the reviews list
        })
        .catch(error => {
            console.error("Error updating review:", error);
            alert(`Error updating review: ${error.message}`);
        });
}

// Display details for a single review
function displayReviewDetails(reviewId) {
    fetch(`${reviewHost}/${reviewId}`)
        .then(response => response.json())
        .then(review => {
            const detailsDiv = document.getElementById('review-details');
            detailsDiv.innerHTML = `
                <h4>Review for Movie ID: ${review.movieId}</h4>
                <p>Rating: ${review.rating}</p>
                <p>Comment: ${review.comment}</p>
            `;
        })
        .catch(error => console.error("Error fetching review details:", error));
}

// Show modal for editing a review
function showEditReviewModal(reviewId) {
    // Fetch review details and populate the edit form fields
    fetch(`${reviewHost}/${reviewId}`)
        .then(response => response.json())
        .then(review => {
            document.getElementById('edit-review-id').value = review.id;
            document.getElementById('edit-review-movie-id').value = review.movieId;
            document.getElementById('edit-review-rating').value = review.rating;
            document.getElementById('edit-review-comment').value = review.comment;
            $('#editReviewModal').modal('show'); // Replace with your modal display logic
        })
        .catch(error => console.error("Error loading review for edit:", error));
}

// Save changes after editing a review
function updateReview() {
    const id = document.getElementById('edit-review-id').value;
    const movieId = document.getElementById('edit-review-movie-id').value;
    const rating = document.getElementById('edit-review-rating').value;
    const comment = document.getElementById('edit-review-comment').value;
    const updatedReview = {
        id: parseInt(id, 10),
        movieId: parseInt(movieId, 10),
        rating: parseInt(rating, 10),
        comment: comment
    };

    fetch(`${reviewHost}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReview)
    })
        .then(response => response.json())
        .then(() => {
            $('#editReviewModal').modal('hide');
            fetchReviews();
        })
        .catch(error => {
            console.error("Error updating review:", error);
            alert(`Error updating review: ${error}`);
        });
}


// Handle delete review action
function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        fetch(`${reviewHost}/${reviewId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete review');
                return response.json();
            })
            .then(() => {
                fetchReviews(); // Refresh the reviews list
            })
            .catch(error => {
                console.error("Error deleting review:", error);
                alert(`Error deleting review: ${error.message}`);
            });
    }
}

// Show modal for editing a review (this is just a placeholder, replace with your actual modal logic)
function showEditReviewModal(reviewId) {
    console.log("Edit Review ID: " + reviewId);

    // Fetch the details of the review from the server
    fetch(`${reviewHost}/${reviewId}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(review => {
            // Assuming you have input fields with the following IDs in your modal form
            document.getElementById('edit-review-id').value = review.id;
            document.getElementById('edit-review-movie-id').value = review.movieId;
            document.getElementById('edit-review-rating').value = review.rating;
            document.getElementById('edit-review-comment').value = review.comment;

            // Now show the modal
            $('#editReviewModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching review details:', error);
            alert('Error fetching review details: ' + error.message);
        });
}


// Close the edit review modal (this is just a placeholder, replace with your actual modal logic)
function closeEditReviewModal() {
    $('#editReviewModal').modal('hide');
}
