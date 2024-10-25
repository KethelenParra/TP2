import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LivroService } from '../service/livro.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm = '';
  results = [];
}
