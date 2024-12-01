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

  findAll(page?: number, pageSize?: number): Observable<Editora[]> {
    let params = {};

    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Editora[]>(`${this.baseUrl}`, {params}); 
  }

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<Editora>(`${this.baseUrl}/image/upload`, formData);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Editora[]> {
    let params = {};
  
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
  
    console.log(params);
    return this.httpClient.get<Editora[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
}

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  insert(editora: Editora): Observable<Editora> {
    const data = {
      nome: editora.nome,
      email: editora.email,
      cidade: editora.cidade,
      estado: editora.estado,
      telefone: {
        codigoArea: editora.telefone.codigoArea,
        numero: editora.telefone.numero,
      },
    };
    console.log(JSON.stringify(data));
    return this.httpClient.post<Editora>(this.baseUrl, data);
  }

  update(editora: Editora): Observable<Editora>{
    const data = {
      nome: editora.nome,
      email: editora.email,
      cidade: editora.cidade,
      estado: editora.estado,
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
