import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EnderecoResponseDTO{
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private apiUrl = 'http://localhost:8080/enderecos'; //URL da API

  constructor(private http: HttpClient) { }

  getEndereco(cep: string): Observable<EnderecoResponseDTO>{
    return this.http.get<EnderecoResponseDTO>(`${this.apiUrl}/${cep}`);
  }
}
