import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Editora } from '../models/editora.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditoraService {
  private baseUrl = 'http://localhost:8080/editoraes';

  constructor(private httpClient: HttpClient) {
  }

  findByNome(nome: string): Observable<Editora>{
    return this.httpClient.get<Editora>(`${this.findByNome}/${nome}`)
  }

  findAll(): Observable<Editora[]>{
    return this.httpClient.get<Editora[]>(this.baseUrl);
  }

  findById(id: string): Observable<Editora>{
    return this.httpClient.get<Editora>(`${this.baseUrl}/${id}`);
  }

  insert(editora: Editora): Observable<Editora> {
    return this.httpClient.post<Editora>(this.baseUrl, editora);
  }

  update(editora: Editora): Observable<Editora>{
    return this.httpClient.put<Editora>(`${this.baseUrl}/${editora.id}`, editora);
  }

  delete(editora: Editora): Observable<any>{//void, sem retorno
    return this.httpClient.delete<any>(`${this.baseUrl}/${editora.id}`);
  }
}
