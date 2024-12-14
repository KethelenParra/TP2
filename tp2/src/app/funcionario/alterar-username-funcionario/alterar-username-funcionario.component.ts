import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Funcionario } from '../../models/funcionario.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FuncionarioService } from '../../service/funcionario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alterar-username-funcionario',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, NgIf, ReactiveFormsModule, MatSnackBarModule, MatButtonModule],
  templateUrl: './alterar-username-funcionario.component.html',
  styleUrl: './alterar-username-funcionario.component.css'
})
export class AlterarUsernameFuncionarioComponent {
  usuarioLogado: any;
  alterar: any;
  funcionario: Funcionario | null = null;
  private subscription = new Subscription();
  formGroup: FormGroup;

  constructor(
      private authService: AuthService,
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private snackBar: MatSnackBar,
      private funcionarioService: FuncionarioService,
      private router: Router,
    ){
      this.formGroup = this.formBuilder.group({
        id: [null],
        username: [{ value: '', disabled: true }], // Campo apenas para exibição
        usernameNovo: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        senha: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
      });
    }

    ngOnInit(): void {
      this.subscription.add(
        this.authService.getUsuarioLogado().subscribe((funcionario) => {
          this.usuarioLogado = funcionario;
          this.funcionario = funcionario; // Atualiza o cliente quando os dados forem carregados
          this.initializeForm(); // Recria o formulário com os dados carregados
        })
      );
  
      const usuarioLogado1 = localStorage.getItem('usuario_logado');
      if (usuarioLogado1) {
        const funcionario = JSON.parse(usuarioLogado1);
        this.funcionarioService.meuPerfil(funcionario.id).subscribe({
          next: (dadosFuncionario) => {
            this.alterar = {
              username: dadosFuncionario.usuario.username,
            };
          },
          error: (err) => console.error('Erro ao carregar o endereço:', err),
        });
      }
    }
  
    initializeForm(): void {
      const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'] || ({ usuario: {}, telefone: {} } as unknown as Funcionario);
      console.log(funcionario);
      this.formGroup.patchValue({
        id: funcionario?.usuario?.id || null,
        currentUsername: funcionario?.usuario?.username || '',
      });
    }
  
  alterarUsername() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const { usernameNovo: usernameNovo, senha: senha } = this.formGroup.value;

      this.funcionarioService.alterarUsername({ usernameNovo, senha }).subscribe({
        next: () => {
          this.snackBar.open('Username alterado com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.router.navigateByUrl('/admin/minhaConta');
        },
        error: (error) => {
          console.error('Erro ao alterar username:', error);
          this.tratarErros(error);
          this.snackBar.open('Erro ao alterar username.', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      }
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }
  }
}
