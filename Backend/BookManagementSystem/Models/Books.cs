using System.ComponentModel.DataAnnotations;

namespace BookManagementSystem.Models
{
    public class Books
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public DateTime PublicationDate { get; set; }
    }
}
