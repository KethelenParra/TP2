import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-template',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {
  headerText: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(() => {
      const path = this.getPathFromRoute(this.route.root);
      this.headerText = this.getHeaderTextByPath(path);
    });
  }

  getPathFromRoute(route: ActivatedRoute): string {
    let currentRoute = route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute.snapshot.url[0]?.path || '';
  }

  getHeaderTextByPath(path: string): string {
    switch (path) {
      case 'generos': return 'Controle de Gêneros';
      case 'livros': return 'Controle de Livros';
      case 'editoras': return 'Controle de Editoras';
      case 'fornecedores': return 'Controle de Fornecedores'
      default: return 'Administração';
    }
  }
}
