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

  findById(id: string): Observable<Box>{
    return this.httpClient.get<Box>(`${this.baseUrl}/${id}`);
  }

  findAll(page?: number, pageSize?: number): Observable<Box[]> {
    let params = {};

    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Box[]>(`${this.baseUrl}`, {params}); 
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  insert(box: Box): Observable<Box> {
    const data = {
      nome: box.nome,
      descricaoBox: box.descricaoBox,
      quantidadeEstoque: box.quantidadeEstoque,
      fornecedor: box.fornecedor.id,
      editora: box.editora.id,
      preco: box.preco,
      classificacao: box.classificacao,
      generos: box.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: box.autores.filter(autor => autor?.id).map(autor => autor.id)
    }
    console.log(JSON.stringify(data));
    return this.httpClient.post<Box>(this.baseUrl, data);
  }

  update(box: Box): Observable<Box>{
    const data = {
      nome: box.nome,
      descricaoBox: box.descricaoBox,
      quantidadeEstoque: box.quantidadeEstoque,
      fornecedor: box.fornecedor.id,
      editora: box.editora.id,
      preco: box.preco,
      classificacao: box.classificacao,
      generos: box.generos.map(genero => genero?.id),
      autores: box.autores.filter(autor => autor?.id).map(autor => autor.id)
    }
    console.log(JSON.stringify(data));
    return this.httpClient.put<Box>(`${this.baseUrl}/${box.id}`, data);
  }

  delete(box: Box): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${box.id}`);
  }
}
