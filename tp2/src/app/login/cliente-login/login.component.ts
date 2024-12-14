import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDivider, RouterModule, MatSnackBarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatListModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  perfilStyle = 2;
  readonly email = new FormControl('', [Validators.email]);
  readonly username = new FormControl('', [Validators.required]);
  readonly senha = new FormControl('', [Validators.required]);
  errorMessage = signal('');
  hide = signal(true);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: this.username,
      password: this.senha
    });
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('Insira um email válido');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const perfil = this.perfilStyle;
      this.authService.login(username, password, perfil).subscribe(
        () => {
          this.router.navigateByUrl('/home');
        },
        (error) => {
          this.snackBar.open('Erro ao logar', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Username ou senha invalidos', 'Close', { duration: 3000 });
    }
  }

  onCadastroSubmit(): void {
    this.router.navigateByUrl('/register');
  }
}
