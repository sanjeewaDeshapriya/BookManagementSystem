import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookManagerDashboardComponent } from "./book-manager-dashboard/book-manager-dashboard.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BookManagerDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Book_Manager_Client';
}
