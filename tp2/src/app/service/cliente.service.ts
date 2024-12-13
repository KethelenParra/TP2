import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Router } from '@angular/router';
import { Box } from '../models/box.model';
import { ItemDesejo } from '../models/item-desejo.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/clientes';

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

    return this.http.patch<void>(`${this.baseUrl}/desejos/adicionar`, null, {
      headers,
      params,
    });
  }

  removerItemDesejo(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.patch<void>(`${this.baseUrl}/desejos/remover/${id}`, {}, { headers });
  }
  getListaDesejos(): Observable<ItemDesejo[]> {
    const headers = this.getHeaders();
    return this.http.get<ItemDesejo[]>(`${this.baseUrl}/desejos`, { headers });
  }

  count(): Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findAll(page: number, pageSize: number): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
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
    return this.http.post<Cliente>(this.baseUrl, cliente);
  }

  // Atualizar um cliente
  update(id: number, cliente: Cliente): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, cliente);
  }

  // Buscar cliente por ID
  findById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  // Buscar cliente por CPF
  findByCpf(cpf: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/search/cpf/${cpf}`);
  }

  // Excluir um cliente
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  meuPerfil(idCliente: number): Observable<Cliente> {
    const headers = this.getHeaders();
    return this.http.get<Cliente>(`${this.baseUrl}/search/meu-perfil`, { headers });
  }

  insertUsuario(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseUrl}`, cliente, { headers: this.getHeaders() });
  }

  updateUsuario(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${cliente.id}`, cliente, { headers: this.getHeaders() });
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

}
