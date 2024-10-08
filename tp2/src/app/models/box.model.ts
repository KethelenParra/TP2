import { Classificacao } from "./classificacao.model";
import { Editora } from "./editora.model";
import { Fornecedor } from "./fornecedor.model";
import { Genero } from "./genero.model";

export class Box {
    id!: number;
    nome!: string;
    descricaoBox!: string;
    quantidadeEstoque!: number;
    fornecedor!: Fornecedor;
    editora!: Editora;
    genero!: Genero;
    preco!: number;
    classificacao!: Classificacao;
}
