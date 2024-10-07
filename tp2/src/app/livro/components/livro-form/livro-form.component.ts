import { Component } from '@angular/core';
import { NavigationService } from '../../../service/navigation.service';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [],
  templateUrl: './livro-form.component.html',
  styleUrl: './livro-form.component.css'
})
export class LivroFormComponent {

  constructor(
    public navService: NavigationService
  ){}
}
