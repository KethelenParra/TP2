import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemPedido } from '../models/item-pedido.model';
import { CartaoCreditoDTO } from '../models/cartao.model';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private apiUrl = 'http://localhost:8080/pedidos';
  private itensCarrinho: Map<number, ItemPedido[]> = new Map();
  private clienteAtualId: number | null = null;
  private carrinhoAtual = new BehaviorSubject<ItemPedido[]>([]);

  constructor(private http: HttpClient) {}

  // Configurar cliente logado
  configurarCliente(idCliente: number): void {
    this.clienteAtualId = idCliente;

    if (!this.itensCarrinho.has(idCliente)) {
      this.itensCarrinho.set(idCliente, []);
    }

    this.carrinhoAtual.next(this.itensCarrinho.get(idCliente)!);
    this.getCarrinho(idCliente);
  }

  // Recuperar carrinho do backend
  getCarrinho(idCliente: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado. Faça login novamente.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>(`${this.apiUrl}/carrinho/${idCliente}`, { headers }).subscribe({
      next: (pedido) => {
        const itens = pedido?.itens?.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
          preco: item.preco,
          quantidade: item.quantidade,
          desconto: item.desconto,
          subTotal: item.subTotal,
        })) || [];
        this.itensCarrinho.set(idCliente, itens);
        this.carrinhoAtual.next(itens);
      },
      error: (err) => {
        console.log('Sem carrinho no backend:', err);
      },
    });
  }

  // Adicionar item ao carrinho
  adicionarAoCarrinho(item: ItemPedido): void {
    if (this.clienteAtualId === null) {
      throw new Error('Cliente não configurado. Por favor, configure o cliente antes de adicionar itens.');
    }

    const carrinho = this.itensCarrinho.get(this.clienteAtualId)!;
    const itemExistente = carrinho.find(
      (i) =>
        (i.idLivro === item.idLivro && item.idLivro !== undefined) ||
        (i.idBox === item.idBox && item.idBox !== undefined)
    );

    if (itemExistente) {
      itemExistente.quantidade += item.quantidade;
    } else {
      carrinho.push(item);
    }

    this.carrinhoAtual.next(carrinho);
    localStorage.setItem(`carrinho_${this.clienteAtualId}`, JSON.stringify(carrinho));
  }

  obterCarrinho(): Observable<ItemPedido[]> {
    return this.carrinhoAtual.asObservable();
  }

  salvarPedido(idCliente: number, itens: ItemPedido[]): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      idCliente,
      itens: itens.map((item) => ({
        idLivro: item.idLivro,
        idBox: item.idBox,
        quantidade: item.quantidade,
      })),
    };

    return this.http.post(`${this.apiUrl}`, body, { headers });
  }

  finalizarPedidoPix(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/search/pagar-Pix`, null, { headers });
  }

  finalizarPedidoBoleto(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/search/pagar-Boleto`, null, { headers });
  }

  finalizarPedidoCartao(cartaoCreditoDTO: CartaoCreditoDTO): Observable<any> { 
    const token = localStorage.getItem('token'); 
    if (!token) 
      { 
        throw new Error('Token não encontrado. Faça login novamente.'); 
      } 
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
      return this.http.patch(`${this.apiUrl}/search/pagar-Cartao-Credito`, cartaoCreditoDTO, { headers});
  }

  atualizarCarrinho(itens: ItemPedido[]): void {
    if (this.clienteAtualId === null) {
      throw new Error('Cliente não configurado.');
    }
    this.carrinhoAtual.next(itens);
  }

  pedidosRealizados(idCliente: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/pedidos-realizados/${idCliente}`, { headers });
  }

  cancelarPedido(): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Realiza a requisição DELETE para o endpoint fornecido
    return this.http.delete<void>(`${this.apiUrl}/search/cancelar-Pedido`, { headers });
  }
  
}
