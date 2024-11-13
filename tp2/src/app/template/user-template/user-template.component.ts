import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-user-template',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, RouterModule],
  templateUrl: './user-template.component.html',
  styleUrl: './user-template.component.css'
})
export class UserTemplateComponent {

}