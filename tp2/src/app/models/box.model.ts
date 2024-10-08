import { Autor } from "./autor.model";
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
    generos!: Genero[];
    autores!: Autor[];
    preco!: number;
    classificacao!: string;
}
