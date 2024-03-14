using MoviesAPI.Models;
using System.ComponentModel.DataAnnotations;

public class Movie
{
    [Key]
    public int Id { get; set; }
    public string Title { get; set; }
    public int ReleaseYear { get; set; }
    public virtual List<Review> Reviews { get; set; } = new List<Review>();
}