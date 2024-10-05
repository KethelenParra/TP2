import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genero } from '../models/genero.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {
  private baseUrl = 'http://localhost:8080/generos';

  constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Genero[]>{
    return this.httpClient.get<Genero[]>(this.baseUrl);
  }

  findById(id: string): Observable<Genero>{
    return this.httpClient.get<Genero>(`${this.baseUrl}/${id}`);
  }

  insert(genero: Genero): Observable<Genero> {
    return this.httpClient.post<Genero>(this.baseUrl, genero);
  }

  update(genero: Genero): Observable<Genero>{
    return this.httpClient.put<Genero>(`${this.baseUrl}/${genero.id}`, genero);
  }

  delete(genero: Genero): Observable<any>{//void, sem retorno
    return this.httpClient.delete<any>(`${this.baseUrl}/${genero.id}`);
  }
}
