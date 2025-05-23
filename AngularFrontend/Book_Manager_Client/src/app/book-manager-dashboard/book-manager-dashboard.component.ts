import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 

interface Book {
  id: number;
  title: string;
  author: string;
  publicationDate: string; 
}

@Component({
  selector: 'app-book-manager-dashboard',
  templateUrl: './book-manager-dashboard.component.html',
  styleUrls: ['./book-manager-dashboard.component.scss'],
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule,  
    HttpClientModule ]
})
export class BookManagerDashboardComponent implements OnInit {
 
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  showAddModal: boolean = false;
  newBook: Book = { id: 0, title: '', author: '', publicationDate: '' };
  isEditMode: boolean = false;
  errorMessage: string | null = null; 

  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchBooks(); 
  }

  
  fetchBooks(): void {
    const apiUrl = 'https://localhost:7170/api/Book/GetBooks';
    this.http.get<Book[]>(apiUrl).subscribe({
      next: (data) => {
        this.books = data;
        this.filteredBooks = [...this.books];
        this.errorMessage = null; 
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.errorMessage = 'Failed to load books. Please ensure the backend API is running and accessible.';
        this.books = []; 
        this.filteredBooks = [];
      }
    });
  }

  get totalBooks(): number {
    return this.books.length;
  }

  get uniqueAuthors(): number {
    return [...new Set(this.books.map(book => book.author))].length;
  }

  get lastAddedYear(): number | string {
    if (this.books.length > 0) {
      const latestBook = this.books.reduce((prev, current) => {
        const prevDate = new Date(prev.publicationDate);
        const currentDate = new Date(current.publicationDate);
        return prevDate > currentDate ? prev : current;
      });
      return new Date(latestBook.publicationDate).getFullYear();
    }
    return 'N/A';
  }

  onSearch(): void {
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddModal(): void {
    this.newBook = { id: 0, title: '', author: '', publicationDate: '' }; 
    this.isEditMode = false;
    this.showAddModal = true;
    this.errorMessage = null;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.errorMessage = null; 
  }

  saveBook(): void {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.publicationDate) {
      this.errorMessage = 'Validation Error: Please fill in all required fields.';
      return;
    }

    if (this.isEditMode) {
      const apiUrl = `https://localhost:7170/api/Book/UpdateBook/${this.newBook.id}`;
      // Include the ID in the update payload
      const bookToUpdate = { 
        id: this.newBook.id,
        title: this.newBook.title, 
        author: this.newBook.author,
        publicationDate: this.newBook.publicationDate
      };
      this.http.patch(apiUrl, bookToUpdate).subscribe({
        next: () => {
          this.fetchBooks();
          this.closeAddModal();
        },
        error: (error) => {
          console.error('Error updating book:', error);
          this.errorMessage = 'Failed to update book. Please try again.';
        }
      });
    } else {
      const apiUrl = 'https://localhost:7170/api/Book/AddBooks';
      const bookToAdd = { 
        
        title: this.newBook.title, 
        author: this.newBook.author,
        publicationDate: this.newBook.publicationDate
      };
      this.http.post(apiUrl, bookToAdd).subscribe({
        next: () => {
          this.fetchBooks(); 
          this.closeAddModal();
        },
        error: (error) => {
          console.error('Error adding book:', error);
          this.errorMessage = 'Failed to add book. Please try again.';
        }
      });
    }
  }

  editBook(book: Book): void {
    
    this.newBook = { 
      id: book.id,
      title: book.title,
      author: book.author,
      publicationDate: this.formatDateForInput(book.publicationDate)
    };
    this.isEditMode = true;
    this.showAddModal = true;
    this.errorMessage = null; 
  }

  deleteBook(id: number): void {
    const apiUrl = `https://localhost:7170/api/Book/DeleteBook/${id}`;
    this.http.delete(apiUrl).subscribe({
      next: () => {
        this.fetchBooks();
      },
      error: (error) => {
        console.error('Error deleting book:', error);
        this.errorMessage = 'Failed to delete book. Please try again.';
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  generateId(): number {
    return this.books.length > 0 ? Math.max(...this.books.map(book => book.id)) + 1 : 1;
  }
}