using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies_ReviewsAPI.DTO;
using MoviesAPI.Models;
using Movies_ReviewsAPI.Data;



namespace Movies_ReviewsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ReviewsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadReviewDTO>>> GetReviews()
        {
            return await _context.Reviews.
                Include(r => r.Movie)
                .Select(r => new ReadReviewDTO
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    MovieId = r.MovieId
                })
                .ToListAsync();
        }

        // GET: api/Reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReadReviewDTO>> GetReview(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.Movie)
                .Where(r => r.Id == id)
                .Select(r => new ReadReviewDTO
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    MovieId = r.MovieId
                })
                .FirstOrDefaultAsync();

            if (review == null)
            {
                return NotFound();
            }

            return review;
        }

        // POST: api/Reviews
        [HttpPost, Authorize]
        public async Task<ActionResult<ReadReviewDTO>> PostReview([FromBody] CreateReviewDTO createReviewDTO)
        {
            var review = new Review
            {
                Rating = createReviewDTO.Rating,
                Comment = createReviewDTO.Comment,
                MovieId = createReviewDTO.MovieId
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
        }

        // PUT: api/Reviews/5
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> PutReview(int id, [FromBody] UpdateReviewDTO updateReviewDTO)
        {
            if (id <= 0)
            {
                return BadRequest();
            }

            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            review.Rating = updateReviewDTO.Rating;
            review.Comment = updateReviewDTO.Comment;
            review.MovieId = updateReviewDTO.MovieId;

            _context.Entry(review).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Reviews/5
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
