import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormatarCpfPipe } from '../../pipes/formatar-cpf.pipe';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormatarTelefonePipe } from '../../pipes/formatar-telefone.pipe';
import { Funcionario } from '../../models/funcionario.model';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';
import { Sexo } from '../../models/sexo.model';
import { AuthService } from '../../service/auth.service';
import { FuncionarioService } from '../../service/funcionario.service';

@Component({
  selector: 'app-minha-conta-funcionaio',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, MatInputModule, FormsModule, MatDivider, FormatarCpfPipe, RouterModule, MatListModule, MatButtonModule, MatCardModule, FormatarTelefonePipe],
  templateUrl: './minha-conta-funcionaio.component.html',
  styleUrl: './minha-conta-funcionaio.component.css'
})
export class MinhaContaFuncionaioComponent {
  formGroup: FormGroup;
  usuarioLogado: any;
  dados: any;
  usuario: Usuario| null = null;
  funcionario: Funcionario | null = null;
  private subscription = new Subscription();
  fileName: string = '';
  hide = signal(true);
  sexos: Sexo[] = [];

  constructor(
      private authService: AuthService,
      private formBuilder: FormBuilder,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private funcionarioService: FuncionarioService,
    ){
      this.formGroup = this.formBuilder.group({
        id: [null],
        nome: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
        username: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
        dataNascimento: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
        telefone: this.formBuilder.group({
          codigoArea: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
          numero: [null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
        }),
        sexo: [null, Validators.required],
        salario: [null, Validators.compose([Validators.required])],
        cargo: ['', Validators.compose([Validators.required])],
      });
    }

    initializeForm(): void {
      const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'] || ({ usuario: {}, telefone: {} } as unknown as Funcionario);
        console.log("funcionario recebido: ", funcionario);
      
        const sexo = this.sexos.find(s => s.id === funcionario?.usuario?.sexo?.id) || null;
      
        this.formGroup = this.formBuilder.group({
          id: [funcionario?.usuario?.id || null],
          nome: [funcionario?.usuario?.nome || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          username: [funcionario?.usuario?.username || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          dataNascimento: [funcionario?.usuario?.dataNascimento || '', Validators.compose([Validators.required])],
          email: [funcionario?.usuario?.email || '', Validators.compose([Validators.required, Validators.email])],
          cpf: [funcionario?.usuario?.cpf || '', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
          telefone: this.formBuilder.group({
            codigoArea: [funcionario?.usuario?.telefone?.codigoArea || '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
            numero: [funcionario?.usuario?.telefone?.numero || '', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(10)])],
          }),
          sexo: [sexo, Validators.required],
          salario: [funcionario?.salario || '', Validators.compose([Validators.required])],
          cargo: [funcionario?.cargo || '', Validators.compose([Validators.required])],
        });
    }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((funcionario) => {
        this.usuarioLogado = funcionario;
        this.funcionario = funcionario; // Atualiza o funcionario quando os dados forem carregados
        this.initializeForm(); // Recria o formulário com os dados carregados
      })
    );
    const usuarioLogado1 = localStorage.getItem('usuario_logado');
    if (usuarioLogado1) {
      const funcionario = JSON.parse(usuarioLogado1);
      this.funcionarioService.meuPerfil(funcionario.id).subscribe({
        next: (dadosCliente) => {
          this.dados = {
            codigoArea: dadosCliente.usuario.telefone?.codigoArea,
            numero: dadosCliente.usuario.telefone?.numero,
            username: dadosCliente.usuario.username,
            salario: dadosCliente.salario,
            cargo: dadosCliente.cargo,
          };
        },
        error: (err) => console.error('Erro ao carregar o endereço:', err),
      });
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
