import { ItemPedido } from "./item-pedido.model";

export interface Pedido {
    id?: number;
    idCliente: number;
    dataPedido?: string;
    valorTotal?: string;
    itens: ItemPedido[];
    statusPagamento?: string;
    statusPedido?: string;
}
