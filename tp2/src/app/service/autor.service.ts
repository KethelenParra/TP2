import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from '../models/autor.model';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private baseUrl = 'http://localhost:8080/autores';

  constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Autor[]>{
    return this.httpClient.get<Autor[]>(this.baseUrl);
  }

  findById(id: string): Observable<Autor>{
    return this.httpClient.get<Autor>(`${this.baseUrl}/${id}`);
  }

  insert(autor: Autor): Observable<Autor> {
    console.log(JSON.stringify(autor));
    return this.httpClient.post<Autor>(this.baseUrl, autor);
  }

  update(autor: Autor): Observable<Autor>{
    console.log(JSON.stringify(autor));
    return this.httpClient.put<Autor>(`${this.baseUrl}/${autor.id}`, autor);
  }

  delete(autor: Autor): Observable<any>{//void, sem retorno
    return this.httpClient.delete<any>(`${this.baseUrl}/${autor.id}`);
  }
}
