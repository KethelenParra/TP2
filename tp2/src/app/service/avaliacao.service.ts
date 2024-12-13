import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/avaliacao.model';


@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  private apiUrl = 'http://localhost:8080/avaliacoes';

  constructor(private http: HttpClient) {}

  getAvaliacoesPorLivro(idLivro: number): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.apiUrl}/livro/${idLivro}`);
  }

  getMediaEstrelas(idLivro: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/livro/${idLivro}/media`);
  }

  adicionarAvaliacao(avaliacao: { comentario: string; estrela: number; idLivro: number }): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(this.apiUrl, avaliacao);
  }

  deletarAvaliacao(idAvaliacao: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idAvaliacao}`);
  }
}
