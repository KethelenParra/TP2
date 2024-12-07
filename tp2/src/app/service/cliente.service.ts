import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Livro } from '../models/livro.model';
import { Router } from '@angular/router';
import { Box } from '../models/box.model';
import { ItemDesejo } from '../models/item-desejo.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient, private router: Router) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('Usuário não autenticado');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  adicionarItemDesejo(idLivro?: number, idBox?: number): Observable<void> {
    const headers = this.getHeaders();
    const params: any = {};
    if (idLivro) params.idLivro = idLivro;
    if (idBox) params.idBox = idBox;

    return this.http.patch<void>(`${this.apiUrl}/desejos/adicionar`, null, {
      headers,
      params,
    });
  }

  removerItemDesejo(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.patch<void>(`${this.apiUrl}/desejos/remover/${id}`, {}, { headers });
  }
  getListaDesejos(): Observable<ItemDesejo[]> {
    const headers = this.getHeaders();
    return this.http.get<ItemDesejo[]>(`${this.apiUrl}/desejos`, { headers });
  }
  
  // Métodos específicos para livros
  adicionarLivroDesejo(idLivro: number): Observable<void> {
    return this.adicionarItemDesejo(idLivro);
  }

  removerLivroDesejo(idLivro: number): Observable<void> {
    return this.removerItemDesejo(idLivro);
  }

  // Métodos específicos para boxes
  adicionarBoxDesejo(idBox: number): Observable<void> {
    return this.adicionarItemDesejo(undefined, idBox);
  }

  removerBoxDesejo(idBox: number): Observable<void> {
    return this.removerItemDesejo(idBox);
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
