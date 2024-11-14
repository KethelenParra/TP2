import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { SidebarComponent } from '../template/sidebar/sidebar.component';
import { FooterComponent } from '../template/footer/footer.component';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-controle',
  standalone: true,
  imports: [MatIcon, MatFormFieldModule, MatToolbar, SidebarComponent, FooterComponent, MatCardModule],
  templateUrl: './controle.component.html',
  styleUrl: './controle.component.css'
})
export class ControleComponent {

}
