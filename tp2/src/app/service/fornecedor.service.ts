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

  findAll(page?: number, pageSize?: number): Observable<Fornecedor[]> {
    let params = {};

    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Fornecedor[]>(`${this.baseUrl}`, {params}); 
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Fornecedor[]> {
    let params = {};
  
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
  
    console.log(params);
    return this.httpClient.get<Fornecedor[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
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
      estado: fornecedor.estado,
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
      estado: fornecedor.estado,
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
