namespace Movies_ReviewsAPI.DTO
{
    public class UpdateReviewDTO
    {
        public int Rating { get; set; }
        public string Comment { get; set; }

        public int MovieId { get; set; }

    }
}
