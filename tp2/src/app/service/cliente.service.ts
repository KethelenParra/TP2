import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Livro } from '../models/livro.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/clientes';

  constructor(private router: Router, private httpClient: HttpClient) {}

  adicionarLivroDesejo(idLivro: number): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Usuário não autenticado'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.patch<void>(`${this.apiUrl}/search/incluir-livro-desejo/${idLivro}`, {}, { headers });
  }

  removerLivroDesejo(idLivro: number): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Usuário não autenticado'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.patch<void>(`${this.apiUrl}/search/remover-livro-desejo/${idLivro}`, {}, { headers });
  }
  
  getLivrosListaDesejos(): Observable<Livro[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}` // Token deve estar armazenado no localStorage
    );
  
    return this.httpClient.get<Livro[]>(`${this.apiUrl}/search/lista-desejos`, { headers });
  }

  insertUsuario(cliente: Cliente): Observable<Cliente> {
    console.log(JSON.stringify(cliente));
    return this.httpClient.post<Cliente>(this.apiUrl, cliente);
  }

  updateUsuario(cliente: Cliente): Observable<Cliente>{
    console.log(JSON.stringify(cliente));
    return this.httpClient.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
  }

  deleteUsuario(cliente: Cliente): Observable<any>{//void, sem retorno
    return this.httpClient.delete<any>(`${this.apiUrl}/${cliente.id}`);
  }

  // Buscar cliente por ID
  findById(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Buscar cliente por CPF
  findByCpf(cpf: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.apiUrl}/search/cpf/${cpf}`);
  }

  // Listar todos os clientes
  findAll(page: number, pageSize: number): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.apiUrl}/count`)
  }

}
