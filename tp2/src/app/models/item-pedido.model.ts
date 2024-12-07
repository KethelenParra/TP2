export interface ItemPedido {
    idLivro?: number; // Caso seja um livro
    idBox?: number;   // Caso seja um box
    titulo?: string;
    preco?: number;
    quantidade: number;
    desconto?: number;
    subTotal?: number;
  }
  