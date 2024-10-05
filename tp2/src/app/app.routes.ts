import { Routes } from '@angular/router';
import { GeneroListComponent } from './genero/components/genero-list/genero-list.component';
import { GeneroFormComponent } from './genero/components/genero-form/genero-form.component';
import { generoResolver } from './genero/resolver/genero.resolver';
import { AutorListComponent } from './autor/components/autor-list/autor-list.component';
import { AutorFormComponent } from './autor/components/autor-form/autor-form.component';
import { autorResolver } from './autor/resolver/autor.resolver';

export const routes: Routes = [
    {path: 'generos',component: GeneroListComponent, title: 'Lista de Generos'},
    {path: 'generos/new',component: GeneroFormComponent, title: 'Novo genero'},
    {path: 'generos/edit/:id', component: GeneroFormComponent, resolve: {genero: generoResolver}},
    {path: 'autores',component: AutorListComponent, title: 'Lista de Autores'},
    {path: 'autores/new',component: AutorFormComponent, title: 'Novo Autor'},
    {path: 'autores/edit/:id', component: AutorFormComponent, resolve: {autor: autorResolver}}
];
