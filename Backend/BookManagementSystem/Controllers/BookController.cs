using BookManagementSystem.DBContext;
using BookManagementSystem.Dto.Request;
using BookManagementSystem.Dto.Response;
using BookManagementSystem.Mapper;
using BookManagementSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _dbContext;
       

        public BookController(BookDbContext dbContext) { 
            _dbContext = dbContext;
        }
        [HttpGet]
        [Route("GetBooks")]
        public async Task<IEnumerable<BookResponseDto>> GetBooks() {
            var books = await _dbContext.Books.ToListAsync();
            return books.Select(BookMapper.ToResponseDto);
        }

        [HttpPost]
        [Route("AddBooks")]
        public async Task<BookRequestDto> AddBook(BookRequestDto bookObj)
        {
            var book = BookMapper.ToEntity(bookObj);
            _dbContext.Books.Add(book);
            await _dbContext.SaveChangesAsync();
            return bookObj;
        }

        [HttpPatch]
        [Route("UpdateBook/{id}")]
        public async Task<Books> UpdateBook(Books bookObj)
        {
            _dbContext.Books.Entry(bookObj).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return bookObj;
        }

        [HttpDelete]
        [Route("DeleteBook/{id}")]
        public bool DeleteBook(int id)
        {
            bool isDeleted=false;
            var book = _dbContext.Books.Find(id);
            if (book != null) {


                _dbContext.Entry(book).State = EntityState.Deleted;
                _dbContext.SaveChanges();

                isDeleted = true;
            }

            return isDeleted;

        }

    }
}
