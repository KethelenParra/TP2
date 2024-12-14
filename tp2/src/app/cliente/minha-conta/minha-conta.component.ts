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
import { Sexo } from '../../models/sexo.model';

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
  sexos: Sexo[] = [];
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
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
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((cliente) => {
        this.usuarioLogado = cliente;
        this.cliente = cliente; // Atualiza o cliente quando os dados forem carregados
        this.initializeForm(); // Recria o formulário com os dados carregados
      })
    );

  }

  initializeForm(): void {
    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'] || ({ usuario: {}, telefone: {} } as unknown as Cliente);
      console.log("Cliente recebido: ", cliente);
    
      const sexo = this.sexos.find(s => s.id === cliente?.usuario?.sexo?.id) || null;
    
      this.formGroup = this.formBuilder.group({
        id: [cliente?.usuario?.id || null],
        nome: [cliente?.usuario?.nome || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        username: [cliente?.usuario?.username || '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        dataNascimento: [cliente?.usuario?.dataNascimento || '', Validators.compose([Validators.required])],
        email: [cliente?.usuario?.email || '', Validators.compose([Validators.required, Validators.email])],
        cpf: [cliente?.usuario?.cpf || '', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
        telefone: this.formBuilder.group({
          codigoArea: [cliente?.usuario?.telefone?.codigoArea || '', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(3)])],
          numero: [cliente?.usuario?.telefone?.numero || '', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(10)])],
        }),
        sexo: [sexo, Validators.required],
      });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  
}
