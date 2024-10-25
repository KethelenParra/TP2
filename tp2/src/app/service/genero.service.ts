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

  findAll(page?: number, pageSize?: number): Observable<Genero[]> {
    let params = {};

    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Genero[]>(`${this.baseUrl}`, {params}); 
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Genero[]> {
    let params = {};
  
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
  
    console.log(params);
    return this.httpClient.get<Genero[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
}

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findById(id: string): Observable<Genero>{
    return this.httpClient.get<Genero>(`${this.baseUrl}/${id}`);
  }

  insert(genero: Genero): Observable<Genero> {
    console.log(JSON.stringify(genero));
    return this.httpClient.post<Genero>(this.baseUrl, genero);
  }

  update(genero: Genero): Observable<Genero>{
    return this.httpClient.put<Genero>(`${this.baseUrl}/${genero.id}`, genero);
  }

  delete(genero: Genero): Observable<any>{//void, sem retorno
    return this.httpClient.delete<any>(`${this.baseUrl}/${genero.id}`);
  }
}
