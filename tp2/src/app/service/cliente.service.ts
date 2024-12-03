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

  constructor(private http: HttpClient, private router: Router) {}

  adicionarLivroDesejo(idLivro: number): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Usuário não autenticado'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<void>(`${this.apiUrl}/search/incluir-livro-desejo/${idLivro}`, {}, { headers });
  }

  removerLivroDesejo(idLivro: number): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Usuário não autenticado'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<void>(`${this.apiUrl}/search/remover-livro-desejo/${idLivro}`, {}, { headers });
  }
  
  getLivrosListaDesejos(): Observable<Livro[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}` // Token deve estar armazenado no localStorage
    );
  
    return this.http.get<Livro[]>(`${this.apiUrl}/search/lista-desejos`, { headers });
  }
  
  // Criar um cliente
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  // Atualizar um cliente
  update(id: number, cliente: Cliente): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, cliente);
  }

  // Buscar cliente por ID
  findById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Buscar cliente por CPF
  findByCpf(cpf: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/search/cpf/${cpf}`);
  }

  // Listar todos os clientes
  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  // Excluir um cliente
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
