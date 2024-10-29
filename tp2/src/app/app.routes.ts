import { Routes } from '@angular/router';
import { GeneroListComponent } from './genero/components/genero-list/genero-list.component';
import { GeneroFormComponent } from './genero/components/genero-form/genero-form.component';
import { generoResolver } from './genero/resolver/genero.resolver';
import { AutorListComponent } from './autor/components/autor-list/autor-list.component';
import { AutorFormComponent } from './autor/components/autor-form/autor-form.component';
import { autorResolver } from './autor/resolver/autor.resolver';
import { BoxListComponent } from './box/components/box-list/box-list.component';
import { BoxFormComponent } from './box/components/box-form/box-form.component';
import { boxResolver } from './box/resolver/box.resolver';
import { EditoraListComponent } from './editora/components/editora-list/editora-list.component';
import { EditoraFormComponent } from './editora/components/editora-form/editora-form.component';
import { editoraResolver } from './editora/resolver/editora.resolver';
import { FornecedorListComponent } from './fornecedor/components/fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './fornecedor/components/fornecedor-form/fornecedor-form.component';
import { fornecedorResolver } from './fornecedor/resolver/fornecedor.resolver';
import { livroResolver } from './livro/resolver/livro.resolver';
import { LivroFormComponent } from './livro/components/livro-form/livro-form.component';
import { LivroListComponent } from './livro/components/livro-list/livro-list.component';
import { HomeComponent } from './home/home.component';
import { ClienteViewComponent } from './cliente/cliente-view/cliente-view.component';
import { ClienteFormComponent } from './cliente/cliente-form/cliente-form.component';
import { clienteResolver } from './cliente/resolver/cliente.resolver';

export const routes: Routes = [
    {path: 'clientes', component: ClienteViewComponent, title: 'Clientes'},
    {path: 'clientes/form', component: ClienteFormComponent, title: 'Formulário de Cliente'},
    {path: 'clientes/edit/:id', component: ClienteFormComponent, resolve: {cliente: clienteResolver}},

    {path: 'home', component: HomeComponent, title: 'Home page'},

    {path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de fornecedores'},
    {path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo fornecedor'},
    {path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve:{fornecedor: fornecedorResolver}},
    
    {path: 'editoras', component: EditoraListComponent, title: 'Lista de editoras'},
    {path: 'editoras/new', component: EditoraFormComponent, title: 'Nova editora'},
    {path: 'editoras/edit/:id', component: EditoraFormComponent, resolve:{editora: editoraResolver}},
    
    {path: 'boxes', component: BoxListComponent, title: 'Lista de boxes'},
    {path: 'boxes/new', component: BoxFormComponent, title: 'Novo box'},
    {path: 'boxes/edit/:id', component: BoxFormComponent, resolve: {box: boxResolver}},
    
    {path: 'generos',component: GeneroListComponent, title: 'Lista de Generos'},
    {path: 'generos/new',component: GeneroFormComponent, title: 'Novo genero'},
    {path: 'generos/edit/:id', component: GeneroFormComponent, resolve: {genero: generoResolver}},
    
    {path: 'autores',component: AutorListComponent, title: 'Lista de Autores'},
    {path: 'autores/new',component: AutorFormComponent, title: 'Novo Autor'},
    {path: 'autores/edit/:id', component: AutorFormComponent, resolve: {autor: autorResolver}},

    {path: 'livros',component: LivroListComponent, title: 'Lista de Livros'},
    {path: 'livros/new',component: LivroFormComponent, title: 'Novo Livro'},
    {path: 'livros/edit/:id', component: LivroFormComponent, resolve: {livro: livroResolver}}
];
