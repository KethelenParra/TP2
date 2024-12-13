import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private apiUrl = 'http://localhost:8080/funcionarios';

  constructor(private http: HttpClient) {}

  findAll(page: number, pageSize: number): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}