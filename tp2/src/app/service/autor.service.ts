import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Autor } from '../models/autor.model';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private baseUrl = 'http://localhost:8080/autores';

  constructor(private httpClient: HttpClient) {
  }

  findAll(page?: number, pageSize?: number): Observable<Autor[]> {
    let params = {};

    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Autor[]>(`${this.baseUrl}`, {params}); 
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<Autor>{
    console.log(`Buscando autor com ID: ${id}`);
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
