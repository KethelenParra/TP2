import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../service/cliente.service';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { EnderecoService, EnderecoResponseDTO } from '../../service/endereco.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CadastroBasicoService } from '../../service/cadastroBasico.service';
import { CadastroBasicoDTO } from '../../models/cadastroBasicoDTO.model';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, CommonModule, MatInputModule, MatSnackBarModule, MatDividerModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css'],
})
export class CadastroClienteComponent implements OnInit {
  cadastroForm!: FormGroup;
  endereco: EnderecoResponseDTO | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroBasicoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void{
    this.initializeForm();
  }

  initializeForm(): void {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      idSexo: ['', Validators.required],
      cep: [''],
      logradouro: [''],
      complemento: [''],
      bairro: [''],
      localidade: [''],
      uf: [''],
    });
  }

  cadastrar(): void {
    if (this.cadastroForm.valid) {
      const cadastro: CadastroBasicoDTO = this.cadastroForm.value;

      this.cadastroService.create(cadastro).subscribe({
        next: () => {
          this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro no cadastro', err);
          this.snackBar.open('Erro ao realizar o cadastro!', 'Fechar', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
    }
  }
}