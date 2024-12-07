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
import { UserTemplateComponent } from './template-user/user-template/user-template.component';
import { AdminTemplateComponent } from './template/admin-template/admin-template.component';
import { LivroCardListComponent } from './livro/components/livro-card-list/livro-card-list.component';
import { ControleComponent } from './controle/controle.component';
import { LivroViewComponent } from './livro-view/components/livro-view.component';
import { livroViewResolver } from './livro-view/resolver/livroView.resolver';
import { LoginComponent } from './login/cliente-login/login.component';
import { BoxCardListComponent } from './box/components/box-card-list/box-card-list.component';
import { BoxViewComponent } from './box/components/box-view/box-view.component';
import { BoxViewResolver } from './box/components/box-view/resolver/BoxView.resolver';
import { HomeComponent } from './home/home.component';
import { AdmLoginComponent } from './login/adm-login/adm-login.component';
import { AuthGuard } from './authGuard';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { MinhaContaComponent } from './cliente/minha-conta/minha-conta.component';
import { EnderecoComponent } from './usuario/endereco/endereco.component';
import { CadastroClienteComponent } from './cliente/cadastro-cliente/cadastro-cliente.component';
import { CarrinhoComponent } from './carrinho/components/carrinho.component';

export const routes: Routes = [
    {
        path: '',
        component: UserTemplateComponent,
        title: 'e-commerce',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },

            { path: 'home', component: HomeComponent, title: 'Home' },
            
            { path: 'login', component: LoginComponent, title: 'Login'},

            { path: 'favoritos', component: FavoritosComponent, title: 'Favoritos' },

            { path: 'livrosCard', component: LivroCardListComponent, title: 'Lista de Cards de Livros' },

            { path: 'boxesCard', component: BoxCardListComponent, title: 'Lista de Cards de Boxes' },

            { path: 'titulo/:titulo', component: LivroViewComponent, resolve: { livro: livroViewResolver } },

            { path: 'nome/:nome', component: BoxViewComponent, resolve: { box: BoxViewResolver } },

            { path: 'minhaConta', component: MinhaContaComponent, title: 'Minha Conta' },

            {path: 'register', component: CadastroClienteComponent, title: 'Registrar Usuário'},
            
            { path: 'carrinho', component: CarrinhoComponent, title: 'Carrinho de compra' },
        ]
    },
    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'administração',
        // canActivate: [AuthGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'controle' },

            { path: 'loginAdm', component: AdmLoginComponent, title: 'Login Adm' },

            { path: 'controle', component: ControleComponent, title: 'Controle' },

            { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de fornecedores' },
            { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo fornecedor' },
            { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve: { fornecedor: fornecedorResolver } },

            { path: 'editoras', component: EditoraListComponent, title: 'Lista de editoras' },
            { path: 'editoras/new', component: EditoraFormComponent, title: 'Nova editora' },
            { path: 'editoras/edit/:id', component: EditoraFormComponent, resolve: { editora: editoraResolver } },

            { path: 'boxes', component: BoxListComponent, title: 'Lista de boxes' },
            { path: 'boxes/new', component: BoxFormComponent, title: 'Novo box' },
            { path: 'boxes/edit/:id', component: BoxFormComponent, resolve: { box: boxResolver } },

            { path: 'generos', component: GeneroListComponent, title: 'Lista de Generos' },
            { path: 'generos/new', component: GeneroFormComponent, title: 'Novo genero' },
            { path: 'generos/edit/:id', component: GeneroFormComponent, resolve: { genero: generoResolver } },

            { path: 'autores', component: AutorListComponent, title: 'Lista de Autores' },
            { path: 'autores/new', component: AutorFormComponent, title: 'Novo Autor' },
            { path: 'autores/edit/:id', component: AutorFormComponent, resolve: { autor: autorResolver } },

            { path: 'livros', component: LivroListComponent, title: 'Lista de Livros' },
            { path: 'livros/new', component: LivroFormComponent, title: 'Novo Livro' },
            { path: 'livros/edit/:id', component: LivroFormComponent, resolve: { livro: livroResolver } }
        ]
    }
];