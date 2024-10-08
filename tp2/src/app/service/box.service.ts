import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Box } from '../models/box.model';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private baseUrl = 'http://localhost:8080/boxes';

  constructor(private httpClient: HttpClient) {
  }

  findByNome(nome: string): Observable<Box>{
    return this.httpClient.get<Box>(`${this.findByNome}/${nome}`)
  }

  findAll(): Observable<Box[]>{
    return this.httpClient.get<Box[]>(this.baseUrl);
  }

  findById(id: string): Observable<Box>{
    return this.httpClient.get<Box>(`${this.baseUrl}/${id}`);
  }

  insert(box: Box): Observable<Box> {
    return this.httpClient.post<Box>(this.baseUrl, box);
  }

  update(box: Box): Observable<Box>{
    return this.httpClient.put<Box>(`${this.baseUrl}/${box.id}`, box);
  }

  delete(box: Box): Observable<any>{//void, sem retorno
    return this.httpClient.delete<any>(`${this.baseUrl}/${box.id}`);
  }
}
