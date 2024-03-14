using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies_ReviewsAPI.DTO;
using Movies_ReviewsAPI.Data;


namespace Movies_ReviewsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public MoviesController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Movies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadMovieDTO>>> GetMovies()
        {
            return await _context.Movies
                .Include(m => m.Reviews) // Ensure you include related data if necessary
                .Select(m => new ReadMovieDTO
                {
                    Id = m.Id,
                    Title = m.Title,
                    ReleaseYear = m.ReleaseYear,
                    Reviews = m.Reviews.Select(r => new ReadReviewDTO
                    {
                        Id = r.Id,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        MovieId = r.MovieId
                    }).ToList()
                }).ToListAsync();
        }

        // GET: api/Movies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReadMovieDTO>> GetMovie(int id)
        {
            var movie = await _context.Movies
                .Where(m => m.Id == id)
                .Include(m => m.Reviews) // Include reviews to provide detailed information
                .Select(m => new ReadMovieDTO
                {
                    Id = m.Id,
                    Title = m.Title,
                    ReleaseYear = m.ReleaseYear,
                    Reviews = m.Reviews.Select(r => new ReadReviewDTO
                    {
                        Id = r.Id,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        MovieId = r.MovieId
                    }).ToList()
                }).FirstOrDefaultAsync();

            if (movie == null)
            {
                return NotFound();
            }

            return movie;
        }

        // POST: api/Movies
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReadMovieDTO>> PostMovie([FromBody] CreateMovieDTO createMovieDTO)
        {
            var movie = new Movie
            {
                Title = createMovieDTO.Title,
                ReleaseYear = createMovieDTO.ReleaseYear
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, new ReadMovieDTO
            {
                Id = movie.Id,
                Title = movie.Title,
                ReleaseYear = movie.ReleaseYear
            });
        }

        // PUT: api/Movies/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutMovie(int id, [FromBody] UpdateMovieDTO updateMovieDTO)
        {
            if (id != updateMovieDTO.Id)
            {
                return BadRequest();
            }

            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            movie.Title = updateMovieDTO.Title;
            movie.ReleaseYear = updateMovieDTO.ReleaseYear;
            _context.Entry(movie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieExists(int id) => _context.Movies.Any(e => e.Id == id);
    }
}
