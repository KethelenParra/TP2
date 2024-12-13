import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Router } from '@angular/router';
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

  findAll(page?: number, pageSize?: number): Observable<Cliente[]> {
    let params = {};

    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.http.get<Cliente[]>(`${this.baseUrl}`,{params});
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
  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${cliente.id}`, cliente);
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
  delete(cliente: Cliente): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${cliente.id}`, {headers: this.getHeaders()});
  }

  atualizarStatus(id: number, ativo: boolean): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch(`${this.baseUrl}/${id}/status`, { ativo }, { headers });
  }
  
  meuPerfil(idCliente: number): Observable<Cliente> {
    const headers = this.getHeaders();
    return this.http.get<Cliente>(`${this.baseUrl}/search/meu-perfil`, { headers });
  }
  insertUsuario(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseUrl}`, cliente, { headers: this.getHeaders() });
  }
}
