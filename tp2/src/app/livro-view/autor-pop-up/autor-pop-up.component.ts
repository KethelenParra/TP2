import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-autor-pop-up',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './autor-pop-up.component.html',
  styleUrl: './autor-pop-up.component.css'
})
export class AutorPopUpComponent {
  @Input() autor: { name: string; bio: string; image: string } = {
    name: '',
    bio: '',
    image: ''
  };
}
