using System;
using System.ComponentModel.DataAnnotations;

namespace BookManagementSystem.Models
{
    public class Books
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string? Isbm { get; set; }

        [Required]
        public DateTime PublicationDate { get; set; }
    }
}
