import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Box } from '../models/box.model';
import { Fornecedor } from '../models/fornecedor.model';
import { Classificacao } from '../models/classificacao.model';

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

    const data = {
      nome: box.nome,
      quantidadeEstoque: box.quantidadeEstoque,
      fornecedor: {
        nome: box.fornecedor.nome,
        cnpj: box.fornecedor.cnpj,
        inscricaoEstadual: box.fornecedor.inscricaoEstadual,
        email: box.fornecedor.email,
        quantLivrosFornecido: box.fornecedor.quantLivrosFornecido,
        telefone: {
          codigoArea: box.fornecedor.telefone.codigoArea,
          numero: box.fornecedor.telefone.numero
        },
        estado: box.fornecedor.estado,
        cidade: box.fornecedor.cidade,
      },
      descricaoBox: box.descricaoBox,
      preco: box.preco,
      classificacao: box.classificacao,
      editora: {
        nome: box.editora.nome,
        email: box.editora.email,
        telefone: {
          codigoArea: box.editora.telefone.codigoArea,
          numero: box.editora.telefone.numero
        },
        estado: box.editora.estado,
        cidade: box.editora.cidade
      },
      genero: {
        nome: box.genero.nome,
        descricao: box.genero.descricao
      }
    }

    return this.httpClient.post<Box>(this.baseUrl, data);
  }

  update(box: Box): Observable<Box>{
    return this.httpClient.put<Box>(`${this.baseUrl}/${box.id}`, box);
  }

  delete(box: Box): Observable<any>{//void, sem retorno
    return this.httpClient.delete<any>(`${this.baseUrl}/${box.id}`);
  }
}
