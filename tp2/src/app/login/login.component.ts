import { Component, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, MatDivider, MatFormFieldModule, RouterModule, ReactiveFormsModule, MatSnackBarModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ){}
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });  
  }

  // onSubmit(){
  //   if (this.loginForm.valid) {
  //     const username = this.loginForm.get('username')?.value;
  //     const password = this.loginForm.get('password')?.value;
  //     this.authService.loginADM(username, password).subscribe ({
  //       next: (resp) => {
  //         // redirecionando para a pagina principal
  //         this.router.navigateByUrl('/admin');
  //       },
  //       error: (err) => {
  //         console.log(err);
  //         this.showSnackbarTopPosition("Username ou senha inválido");
  //       }
  //     })
  //   }
  // }

  // onRegister() {
  //   // criar usuário
  // }

  showSnackbarTopPosition(content: string) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}
