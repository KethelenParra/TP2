import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';
import { Classificacao } from '../models/classificacao.model';

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

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<Livro>(`${this.baseUrl}/image/upload`, formData);
  }

  findClassificacoes(): Observable<Classificacao[]>{
    return this.httpClient.get<Classificacao[]>(`${this.baseUrl}/classificacao`);
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

    return this.httpClient.get<Livro[]>(this.baseUrl, {params});
  }

  findByFilters(
    autores: number[],
    editoras: number[],
    generos: number[],
    page?: number,
    pageSize?: number
  ): Observable<{ livros: Livro[]; editoras: number[]; generos: number[]; autores: number[] }> {
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
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }
  
    return this.httpClient.get<{ livros: Livro[]; editoras: number[]; generos: number[]; autores: number[] }>(
      `${this.baseUrl}/search/filters`,
      { params }
    );
  }
    
  findByTitulo(nome: string, page?: number, pageSize?: number): Observable<Livro[]> {
    // Inicializa os parâmetros da query string
    const params: any = {};
  
    // Adiciona paginação se fornecida
    if (page !== undefined) {
      params.page = page.toString();
    }
    if (pageSize !== undefined) {
      params.pageSize = pageSize.toString();
    }
  
    console.log('Parâmetros da requisição:', params);
  
    // Faz a requisição HTTP diretamente com o nome recebido
    return this.httpClient.get<Livro[]>(
      `${this.baseUrl}/search/titulo/${encodeURIComponent(nome)}`, 
      { params }
    );
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
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/titulo/${nome}`);
  }

  countByAutor(autor: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/autor/${autor}`);
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
      classificacao: livro.classificacao.id,
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
      classificacao: livro.classificacao.id || null,
      editora: livro.editora.id || null,
      fornecedor: livro.fornecedor.id || null,
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