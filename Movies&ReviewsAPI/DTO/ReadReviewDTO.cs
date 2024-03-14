namespace Movies_ReviewsAPI.DTO
{
    public class ReadReviewDTO
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public int MovieId { get; set; } // Including MovieId for reference

    }
}
