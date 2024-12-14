import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Box } from '../models/box.model';
import { Classificacao } from '../models/classificacao.model';
import { CadastroBasicoDTO } from '../models/cadastroBasicoDTO.model';

@Injectable({
  providedIn: 'root'
})
export class CadastroBasicoService{
  private baseUrl = 'http://localhost:8080/cadastroBasicoCliente';


  constructor(private httpClient: HttpClient) {}

  create(dto: CadastroBasicoDTO): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, dto);
  }
}