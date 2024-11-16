import { Component } from '@angular/core';
import { FooterComponent } from '../../template/footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserHeaderComponent } from '../user-header/user-header.component';


@Component({
  selector: 'app-user-template',
  standalone: true,
  imports: [UserHeaderComponent, FooterComponent, RouterOutlet, RouterModule],
  templateUrl: './user-template.component.html',
  styleUrl: './user-template.component.css'
})
export class UserTemplateComponent {

}
