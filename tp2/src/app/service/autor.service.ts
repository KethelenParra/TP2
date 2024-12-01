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

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<Livro>(`${this.baseUrl}/image/upload`, formData);
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findById(id: string): Observable<Autor>{
    console.log(`Buscando autor com ID: ${id}`);
    return this.httpClient.get<Autor>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Autor[]> {
    let params = {};
  
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
  
    console.log(params);
    return this.httpClient.get<Autor[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
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
