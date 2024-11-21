import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDivider, MatFormFieldModule, RouterModule, ReactiveFormsModule, MatSnackBarModule, MatButtonModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  cadastroForm!: FormGroup;
  perfilStyle = 2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      senha: ['', Validators.required]
    });

    this.cadastroForm = this.fb.group({
      emailCadastro: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, senha } = this.loginForm.value;
      const perfil = this.perfilStyle;
      this.authService.login(username, senha, perfil).subscribe(
        () => {
          this.router.navigateByUrl('/home');
        },
        (error) => {
          this.snackBar.open('Erro ao logar', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  onCadastroSubmit(): void {
    if (this.cadastroForm.valid) {
      const { emailCadastro } = this.cadastroForm.value;
      this.authService.register(emailCadastro).subscribe(
        () => {
          this.snackBar.open('Cadastro realizado com sucesso', 'Close', { duration: 3000 });
          this.router.navigate(['/home']);
        },
        (error) => {
          this.snackBar.open('Erro ao cadastrar', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }
}
