import { Fornecedor } from "./fornecedor.model";
import { Livro } from "./livro.model";

export class Box {
    id!: number;
    nome!: string;
    descricaoBox!: string;
    quantidadeEstoque!: number;
    fornecedor!: Fornecedor;
}
