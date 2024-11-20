import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Box } from '../models/box.model';

@Injectable({
  providedIn: 'root'
})
export class BoxService{
  private baseUrl = 'http://localhost:8080/boxes';

  @Input() titulo: string = '';

  constructor(private httpClient: HttpClient) {}

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }
  
  getBoxes(): Observable<Box[]> {
    return this.httpClient.get<Box[]>(`${this.baseUrl}/boxes`);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Box[]> {
    let params = {};
  
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
  
    console.log(params);
    return this.httpClient.get<Box[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
  }

  findByAutor(autor: string, page?: number, pageSize?: number): Observable<Box[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    console.log(params);
    return this.httpClient.get<Box[]>(`${this.baseUrl}/search/autor/${autor}`, { params });
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

  findByFilters(
    autores: number[],
    editoras: number[],
    generos: number[],
    page?: number,
    pageSize?: number
  ): Observable<{ boxes: Box[]; editoras: number[]; generos: number[]; autores: number[] }> {
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
  
    return this.httpClient.get<{ boxes: Box[]; editoras: number[]; generos: number[]; autores: number[] }>(
      `${this.baseUrl}/search/filters`,
      { params }
    );
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  countByAutor(autor: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/autor/${autor}`);
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
      generos: box.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: box.autores.filter(autor => autor?.id).map(autor => autor.id)
    }
    console.log(JSON.stringify(data));
    return this.httpClient.put<Box>(`${this.baseUrl}/${box.id}`, data);
  }

  delete(box: Box): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${box.id}`);
  }
}
