import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private baseUrl = 'http://localhost:8080/livros';

  @Input() titulo: string = '';

  constructor(private httpClient: HttpClient) { }

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }
  getLivros(): Observable<Livro[]> {
    return this.httpClient.get<Livro[]>(`${this.baseUrl}/livros`);
  }

  findAll(page?: number, pageSize?: number): Observable<Livro[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    console.log(params);

    return this.httpClient.get<Livro[]>(`${this.baseUrl}`, { params });
  }

  findByFilters(
    autores: number[],
    editoras: number[],
    generos: number[],
    page?: number,
    pageSize?: number
  ): Observable<Livro[]> {
    let params = new HttpParams();
  
    if (autores.length > 0) {
      params = params.set('autores', autores.join(','));
    }
    if (editoras.length > 0) {
      params = params.set('editoras', editoras.join(','));
    }
    if (generos.length > 0) {
      params = params.set('generos', generos.join(','));
    }
  
    return this.httpClient.get<Livro[]>(`${this.baseUrl}/search/filters`, { params });
  }
  
  
  findByTitulo(nome: string, page?: number, pageSize?: number): Observable<Livro[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    console.log(params);
    return this.httpClient.get<Livro[]>(`${this.baseUrl}/search/titulo/${nome}`, { params });
  }

  findByAutor(autor: string, page?: number, pageSize?: number): Observable<Livro[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    console.log(params);
    return this.httpClient.get<Livro[]>(`${this.baseUrl}/search/autor/${autor}`, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  countByAutor(autor: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${autor}`);
  }

  findById(id: string): Observable<Livro> {
    return this.httpClient.get<Livro>(`${this.baseUrl}/${id}`);
  }

  insert(livro: Livro): Observable<Livro> {
    const data = {
      titulo: livro.titulo,
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
      titulo: livro.titulo,
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