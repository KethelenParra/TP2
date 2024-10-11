import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/fornecedor.model';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private baseUrl = 'http://localhost:8080/fornecedores';


  constructor(private httpClient: HttpClient) { }

  findById(id: string): Observable<Fornecedor>{
    return this.httpClient.get<Fornecedor>(`${this.baseUrl}/${id}`);
  }

  findAll(): Observable<Fornecedor[]>{
    return this.httpClient.get<Fornecedor[]>(this.baseUrl);
  }

  findByNome(nome: string): Observable<Fornecedor>{
    return this.httpClient.get<Fornecedor>(`${this.findByNome}/${nome}`)
  } 

  findByCnpj(cnpj: string): Observable<Fornecedor>{
    return this.httpClient.get<Fornecedor>(`${this.findByCnpj}/${cnpj}`)
  }

  insert(fornecedor: Fornecedor): Observable<Fornecedor> {
    const data = {
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      inscricaoEstadual: fornecedor.inscricaoEstadual,
      email: fornecedor.email,
      estado: fornecedor.email,
      cidade: fornecedor.cidade,
      telefone: {
        codigoArea: fornecedor.telefone.codigoArea,
        numero: fornecedor.telefone.numero,
      },
      quantLivrosFornecido: fornecedor.quantLivrosFornecido,
    };
    console.log(JSON.stringify(data));
    return this.httpClient.post<Fornecedor>(this.baseUrl, data);
  }

  update(fornecedor: Fornecedor): Observable<Fornecedor>{
    const data = {
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      inscricaoEstadual: fornecedor.inscricaoEstadual,
      email: fornecedor.email,
      estado: fornecedor.email,
      cidade: fornecedor.cidade,
      telefone: {
        codigoArea: fornecedor.telefone.codigoArea,
        numero: fornecedor.telefone.numero,
      },
      quantLivrosFornecido: fornecedor.quantLivrosFornecido,
    };
    return this.httpClient.put<Fornecedor>(`${this.baseUrl}/${fornecedor.id}`, data);
  }

  delete(fornecedor: Fornecedor): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${fornecedor.id}`);
  }
}
