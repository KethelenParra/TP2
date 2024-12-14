import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Usuario } from '../../../models/usuario.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-alterar-username',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, NgIf],
  templateUrl: './alterar-username.component.html',
  styleUrl: './alterar-username.component.css'
})
export class AlterarUsernameComponent implements OnInit{
  usuarioLogado: any;
  usuario: Usuario| null = null;
  private subscription = new Subscription();
  formGroup: FormGroup;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ){
    this.formGroup = this.formBuilder.group({
      id: [null],
      username: ['', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
      const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];
  
      this.formGroup = this.formBuilder.group({
        id: [(cliente && cliente.usuario.id) ? cliente.usuario.id : null],
        username: [(cliente && cliente.usuario.username) ? cliente.usuario.username : '', Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(100)])],
      });
    }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessage[controlName] && this.errorMessage[controlName][errorName]) {
        return this.errorMessage[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }
  
  errorMessage: { [controlName: string]: {[errorName: string] : string} } = {
    username: {
      required: 'Campo obrigatório',
      minlength: 'Username deve ter no mínimo 3 caracteres',
    }
  }
}
