namespace Movies_ReviewsAPI.DTO
{
    public class ReadMovieDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int ReleaseYear { get; set; }
        public List<ReadReviewDTO> Reviews { get; set; } = new List<ReadReviewDTO>();

    }
}
