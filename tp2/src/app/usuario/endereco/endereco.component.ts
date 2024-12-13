import { Component } from '@angular/core';
import { EnderecoResponseDTO, EnderecoService } from '../../service/endereco.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-endereco',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './endereco.component.html',
  styleUrl: './endereco.component.css'
})
export class EnderecoComponent {
  cep: string = '';
  endereco: EnderecoResponseDTO | null = null;
  error: string | null = null;

  constructor(private enderecoService: EnderecoService){}
  
  buscarEndereco(){
    this.enderecoService.getEndereco(this.cep).subscribe(
      (data) => {
        this.endereco = data;
        this.error = null;
      },
      (error) => {
        this.error = 'Erro ao buscar o endereço';
        this.endereco = null;
      }
    );
  }
}
