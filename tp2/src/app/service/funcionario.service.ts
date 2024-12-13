import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario.model';
import { Router } from '@angular/router';
import { Sexo } from '../models/sexo.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private baseUrl = 'http://localhost:8080/funcionarios';

  constructor(private http: HttpClient, private router: Router) {}

    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login']);
        throw new Error('Usuário não autenticado');
      }
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

  findAll(page: number, pageSize: number): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  findSexos(): Observable<Sexo[]> {
    return this.http.get<Sexo[]>(`${this.baseUrl}/sexo`);
  }

  findById(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`);
  }
  
  // Criar um funcionario
  create(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.baseUrl, funcionario);
  }

  // Atualizar um funcionario
  update(funcionario: Funcionario): Observable<Funcionario> {
    console.log(funcionario);
    const data = {
      nome: funcionario?.usuario?.nome,
      username: funcionario?.usuario?.username,
      cargo: funcionario?.cargo,
      dataNascimento: funcionario?.usuario?.dataNascimento,
      email: funcionario?.usuario?.email,
      telefone: {
        codigoArea: funcionario?.usuario?.telefone?.codigoArea,
        numero: funcionario?.usuario?.telefone?.numero
      },
      sexo: funcionario?.usuario?.sexo,
      salario: funcionario?.salario,
    }
    return this.http.put<Funcionario>(`${this.baseUrl}/${funcionario?.usuario?.id}`, data);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  delete(funcionario: Funcionario): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${funcionario.id}`, { headers: this.getHeaders() });
  }
}