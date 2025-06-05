

using BookManagementSystem.Dto.Response;
using global::BookManagementSystem.Dto.Request;
using global::BookManagementSystem.Models;
namespace BookManagementSystem.Mapper


{
    public static class BookMapper
    {
        
        public static Books ToEntity(BookRequestDto dto)
        {
            return new Books
            {
                Title = dto.Title,
                Author = dto.Author,
                Isbm = dto.Isbm,
                PublicationDate = dto.PublicationDate
            };
        }

        
        public static BookRequestDto ToDto(Books entity)
        {
            return new BookRequestDto
            {
                Title = entity.Title,
                Author = entity.Author,
                Isbm = entity.Isbm,
                PublicationDate = entity.PublicationDate
            };
        }

        public static BookResponseDto ToResponseDto(Books entity)
        {
            return new BookResponseDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Author = entity.Author,
                Isbm = entity.Isbm,
                PublicationDate = entity.PublicationDate
            };
        }


        public static void UpdateEntity(Books entity, BookRequestDto dto)
        {
            entity.Title = dto.Title;
            entity.Author = dto.Author;
            entity.Isbm = dto.Isbm;
            entity.PublicationDate = dto.PublicationDate;
        }
    }
}