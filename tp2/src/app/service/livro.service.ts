import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private baseUrl = 'http://localhost:8080/livros';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Livro[]>{
    return this.httpClient.get<Livro[]>(this.baseUrl);
  }

  findById(id: string): Observable<Livro>{
    return this.httpClient.get<Livro>(`${this.baseUrl}/${id}`);
  }

  insert(livro: Livro): Observable<Livro> {
    const data = {
      titulo : livro.titulo,
      quantidadeEstoque: livro.quantidadeEstoque,
      preco: livro.preco,
      isbn: livro.isbn,
      descricao: livro.descricao,
      datalancamento: livro.datalancamento,
      classificacao: livro.classificacao,
      editora: livro.editora.id,
      fornecedor: livro.fornecedor.id,
      generos: livro.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: livro.autores.filter(autor => autor?.id).map(autor => autor.id)
    }
    console.log(JSON.stringify(data));
    return this.httpClient.post<Livro>(this.baseUrl, data);
  }

  update(livro: Livro): Observable<Livro> {
    const data = {
      titulo : livro.titulo,
      quantidadeEstoque: livro.quantidadeEstoque,
      preco: livro.preco,
      isbn: livro.isbn,
      descricao: livro.descricao,
      datalancamento: livro.datalancamento,
      classificacao: livro.classificacao,
      editora: livro.editora.id,
      fornecedor: livro.fornecedor.id,
      generos: livro.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: livro.autores.filter(autor => autor?.id).map(autor => autor.id)
    }
    console.log(JSON.stringify(data));
    return this.httpClient.put<Livro>(`${this.baseUrl}/${livro.id}`, data);
  }

  delete(livro: Livro): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${livro.id}`);
  }
}