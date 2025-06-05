import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;  // Added ISBN field
  publicationDate: string;
}

interface AuthorBookCount {
  author: string;
  bookCount: number;
  color: string;
}

@Component({
  selector: 'app-book-manager-dashboard',
  templateUrl: './book-manager-dashboard.component.html',
  styleUrls: ['./book-manager-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class BookManagerDashboardComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  filteredBooks: Book[] = [];
  latestBooks: Book[] = [];
  oldestBooks: Book[] = [];
  authorBookCounts: AuthorBookCount[] = [];
  searchTerm: string = '';
  showAddModal: boolean = false;
  newBook: Book = { id: 0, title: '', author: '', isbn: '', publicationDate: '' };
  isEditMode: boolean = false;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  private colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  ngOnDestroy(): void {
    // Clean up if needed
  }

  fetchBooks(): void {
    this.isLoading = true;
    const apiUrl = 'https://localhost:7170/api/Book/GetBooks';
    this.http.get<Book[]>(apiUrl).subscribe({
      next: (data) => {
        this.books = data;
        this.filteredBooks = [...this.books];
        this.processBookData();
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.errorMessage = 'Failed to load books. Please ensure the backend API is running and accessible.';
        this.loadMockData(); // Load mock data for demonstration
        this.isLoading = false;
      }
    });
  }

  loadMockData(): void {
    // Mock data for demonstration when API is not available
    this.books = [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', publicationDate: '1925-04-10' },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', publicationDate: '1960-07-11' },
      { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', publicationDate: '1949-06-08' },
      { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', publicationDate: '1813-01-28' },
      { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', publicationDate: '1951-07-16' },
      { id: 6, title: 'Animal Farm', author: 'George Orwell', isbn: '978-0-452-28424-1', publicationDate: '1945-08-17' },
      { id: 7, title: 'Lord of the Flies', author: 'William Golding', isbn: '978-0-571-05686-2', publicationDate: '1954-09-17' },
      { id: 8, title: 'Emma', author: 'Jane Austen', isbn: '978-0-14-143959-4', publicationDate: '1815-12-23' },
      { id: 9, title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0-06-085052-4', publicationDate: '1932-08-30' },
      { id: 10, title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0-547-92822-7', publicationDate: '1937-09-21' },
      { id: 11, title: 'Sense and Sensibility', author: 'Jane Austen', isbn: '978-0-14-143966-2', publicationDate: '1811-10-30' },
      { id: 12, title: 'Nineteen Eighty-Four', author: 'George Orwell', isbn: '978-0-452-28425-8', publicationDate: '1948-06-08' }
    ];
    this.filteredBooks = [...this.books];
    this.processBookData();
  }

  processBookData(): void {
    // Sort books by publication date for latest and oldest
    const sortedBooks = [...this.books].sort((a, b) =>
      new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
    );

    // Get latest 5 books
    this.latestBooks = sortedBooks.slice(0, 5);

    // Get oldest 10 books (reverse the sorted array)
    this.oldestBooks = sortedBooks.reverse().slice(0, 10);

    // Group books by author
    const authorGroups = this.books.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    this.authorBookCounts = Object.entries(authorGroups).map(([author, count], index) => ({
      author,
      bookCount: count,
      color: this.colors[index % this.colors.length]
    }));
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
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  openAddModal(): void {
    this.newBook = { id: 0, title: '', author: '', isbn: '', publicationDate: '' };
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
      const bookToUpdate = {
        id: this.newBook.id,
        title: this.newBook.title,
        author: this.newBook.author,
        isbn: this.newBook.isbn,
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
        isbn: this.newBook.isbn,
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
      isbn: book.isbn || '',
      publicationDate: this.formatDateForInput(book.publicationDate)
    };
    this.isEditMode = true;
    this.showAddModal = true;
    this.errorMessage = null;
  }

  deleteBook(id: number): void {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

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

  // Helper methods for dashboard widgets
  getTotalBooksForChart(): number {
    return this.authorBookCounts.reduce((total, item) => total + item.bookCount, 0);
  }

  getPercentage(count: number): number {
    const total = this.getTotalBooksForChart();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  // Helper methods for custom donut chart
  getStrokeColor(colorClass: string): string {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#10b981',
      'bg-yellow-500': '#f59e0b',
      'bg-red-500': '#ef4444',
      'bg-purple-500': '#8b5cf6',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-teal-500': '#14b8a6'
    };
    return colorMap[colorClass] || '#3b82f6';
  }

  getStrokeDashArray(bookCount: number, index: number): string {
    const circumference = 2 * Math.PI * 35; // radius = 35
    const total = this.getTotalBooksForChart();
    const percentage = total > 0 ? (bookCount / total) : 0;
    const dashLength = circumference * percentage;
    return `${dashLength} ${circumference}`;
  }

  getStrokeDashOffset(index: number): number {
    const circumference = 2 * Math.PI * 35;
    let offset = 0;

    for (let i = 0; i < index; i++) {
      const total = this.getTotalBooksForChart();
      const percentage = total > 0 ? (this.authorBookCounts[i].bookCount / total) : 0;
      offset += circumference * percentage;
    }

    return -offset;
  }
}
