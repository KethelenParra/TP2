import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { FormatarCpfPipe } from '../../pipes/formatar-cpf.pipe';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-minha-conta',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatInputModule, FormsModule, MatDivider, FormatarCpfPipe, RouterModule, MatListModule, MatButtonModule, MatCardModule],
  templateUrl: './minha-conta.component.html',
  styleUrl: './minha-conta.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinhaContaComponent implements OnInit{
  formGroup: FormGroup;
  usuarioLogado: any;
  usuario: Usuario| null = null;
  cliente: Cliente | null = null;
  private subscription = new Subscription();
  fileName: string = '';
  hide = signal(true);
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activitedRoute: ActivatedRoute,
    private location: Location
  ){
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      descricao: ['', Validators.required],
      estoque: ['', Validators.required],
      email: ['', Validators.required],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((usuario) => {
        this.usuarioLogado = usuario; // Atualiza o estado do usuário logado
      })
    );
  }

  // onImageSelected(event: Event): void {

  //   const input = event.target as HTMLInputElement;
  //   const file = input.files ? input.files[0] : null;

  //   if (file) {

  //     const reader = new FileReader();

  //     reader.onload = () => {

  //       this.imagemPreview = reader.result as string;

  //     };

  //     reader.readAsDataURL(file);

  //   }


  // }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  // initializeForm(): void{
  //   const usuario: Cliente = this.activitedRoute.snapshot.data['perfil'];

  //   if(usuario && this.usuario.nomeImagem)
  // }
  
}
