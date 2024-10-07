import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Editora } from '../models/editora.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditoraService {
  private baseUrl = 'http://localhost:8080/editoras';

  constructor(private httpClient: HttpClient) {
  }

  findById(id: string): Observable<Editora>{
    return this.httpClient.get<Editora>(`${this.baseUrl}/${id}`);
  }

  findAll(): Observable<Editora[]>{
    return this.httpClient.get<Editora[]>(this.baseUrl);
  }

  findByNome(nome: string): Observable<Editora>{
    return this.httpClient.get<Editora>(`${this.findByNome}/${nome}`)
  }

  insert(editora: Editora): Observable<Editora> {
    const data = {
      nome: editora.nome,
      email: editora.email,
      cidade: editora.cidade,
      estado: editora.email,
      telefone: {
        codigoArea: editora.telefone.codigoArea,
        numero: editora.telefone.numero,
      },
    };
    return this.httpClient.post<Editora>(this.baseUrl, data);
  }

  update(editora: Editora): Observable<Editora>{
    const data = {
      nome: editora.nome,
      email: editora.email,
      cidade: editora.cidade,
      estado: editora.email,
      telefone: {
        codigoArea: editora.telefone.codigoArea,
        numero: editora.telefone.numero,
      },
    };
    return this.httpClient.put<Editora>(`${this.baseUrl}/${editora.id}`, data);
  }

  delete(editora: Editora): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${editora.id}`);
  }
}
