import { Routes } from '@angular/router';
import { GeneroListComponent } from './genero/components/genero-list/genero-list.component';
import { GeneroFormComponent } from './genero/components/genero-form/genero-form.component';
import { generoResolver } from './genero/resolver/genero.resolver';

export const routes: Routes = [
    {path: 'generos',component: GeneroListComponent, title: 'Lista de Generos'},
    {path: 'generos/new',component: GeneroFormComponent, title: 'Novo genero'},
    {path: 'generos/edit/:id', component: GeneroFormComponent, resolve: {genero: generoResolver}},
];
