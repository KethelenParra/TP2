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
import { FavoritosComponent } from './favoritos/favoritos.component';
import { MinhaContaComponent } from './cliente/minha-conta/minha-conta.component';
import { CadastroClienteComponent } from './cliente/cadastro-cliente/cadastro-cliente.component';
import { CarrinhoComponent } from './carrinho/components/carrinho.component';
import { clienteResolver } from './usuario/view-users-admin/resolver/userView.resolver';
import { ViewClientsAdminComponent } from './usuario/view-users-admin/view-clients-admin/view-clients-admin.component';
import { ViewFuncionariosAdminComponent } from './usuario/view-users-admin/view-funcionarios-admin/view-funcionarios-admin.component';
import { funcionarioResolver } from './usuario/view-users-admin/resolver/funcionarioView.resolver';
import { ViewClientesEditComponent } from './usuario/view-users-admin/view-clients-edit/view-clients-edit.component';
import { ViewFuncionariosEditComponent } from './usuario/view-users-admin/view-funcionarios-edit/view-funcionarios-edit.component';
import { authGuard } from './guard/auth.guard';
import { authClienteGuard } from './guard/auth-cliente.guard';
import { FinalizarPedidoComponent } from './carrinho/finalizar-pedido/finalizar-pedido.component';
import { AlterarUsernameComponent } from './cliente/minha-conta/alterar-username/alterar-username.component';

export const routes: Routes = [
    {
        path: '',
        component: UserTemplateComponent,
        title: 'e-commerce',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },

            { path: 'home', component: HomeComponent, title: 'Home' },
            
            { path: 'login', component: LoginComponent, title: 'Login'},

            { path: 'favoritos', component: FavoritosComponent, title: 'Favoritos', canActivate: [authClienteGuard]  },

            { path: 'livrosCard', component: LivroCardListComponent, title: 'Lista de Cards de Livros' },

            { path: 'boxesCard', component: BoxCardListComponent, title: 'Lista de Cards de Boxes' },

            { path: 'titulo/:titulo', component: LivroViewComponent, resolve: { livro: livroViewResolver } },

            { path: 'nome/:nome', component: BoxViewComponent, resolve: { box: BoxViewResolver } },

            { path: 'carrinho', component: CarrinhoComponent, title: 'Carrinho de compra', canActivate: [authClienteGuard] },
        
            { path: 'finalizarPedido', component: FinalizarPedidoComponent, title: 'Finalizar Pedido', canActivate: [authClienteGuard] },

            { path: 'minhaConta', component: MinhaContaComponent, title: 'Minha Conta' , canActivate: [authClienteGuard]},
            
            { path: 'alterarUsername', component: AlterarUsernameComponent, title: 'Alterar Username', canActivate: [authClienteGuard] },

            { path: 'register', component: CadastroClienteComponent, title: 'Registrar Usuário' },
            
        ]
    },
    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'administração',
        children: [

            { path: '', pathMatch: 'full', redirectTo: 'controle'},

            { path: '', pathMatch: 'full', redirectTo: 'loginAdm' },

            { path: 'viewClients', component: ViewClientsAdminComponent, title: ' Visualização de Clientes' },
            { path: 'viewClients/edit/:id', component: ViewClientesEditComponent, resolve: { cliente: clienteResolver }},
            { path: 'viewFuncionarios', component: ViewFuncionariosAdminComponent, title: ' Visualização de Funcionários' },
            { path: 'viewFuncionarios/edit/:id', component: ViewFuncionariosEditComponent, resolve: {funcionario: funcionarioResolver} },

            { path: 'loginAdm', component: AdmLoginComponent, title: 'Login Adm' },

            { path: 'controle', component: ControleComponent, title: 'Controle', canActivate: [authGuard] },

            { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de fornecedores' },
            { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo fornecedor', canActivate: [authGuard] },
            { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve: { fornecedor: fornecedorResolver }, canActivate: [authGuard] },

            { path: 'editoras', component: EditoraListComponent, title: 'Lista de editoras' },
            { path: 'editoras/new', component: EditoraFormComponent, title: 'Nova editora', canActivate: [authGuard] },
            { path: 'editoras/edit/:id', component: EditoraFormComponent, resolve: { editora: editoraResolver }, canActivate: [authGuard] },

            { path: 'boxes', component: BoxListComponent, title: 'Lista de boxes' },
            { path: 'boxes/new', component: BoxFormComponent, title: 'Novo box', canActivate: [authGuard] },
            { path: 'boxes/edit/:id', component: BoxFormComponent, resolve: { box: boxResolver }, canActivate: [authGuard] },

            { path: 'generos', component: GeneroListComponent, title: 'Lista de Generos' },
            { path: 'generos/new', component: GeneroFormComponent, title: 'Novo genero', canActivate: [authGuard] },
            { path: 'generos/edit/:id', component: GeneroFormComponent, resolve: { genero: generoResolver }, canActivate: [authGuard] },

            { path: 'autores', component: AutorListComponent, title: 'Lista de Autores' },
            { path: 'autores/new', component: AutorFormComponent, title: 'Novo Autor', canActivate: [authGuard] },
            { path: 'autores/edit/:id', component: AutorFormComponent, resolve: { autor: autorResolver }, canActivate: [authGuard] },

            { path: 'livros', component: LivroListComponent, title: 'Lista de Livros' },
            { path: 'livros/new', component: LivroFormComponent, title: 'Novo Livro', canActivate: [authGuard] },
            { path: 'livros/edit/:id', component: LivroFormComponent, resolve: { livro: livroResolver }, canActivate: [authGuard] }
        ]
    }
];