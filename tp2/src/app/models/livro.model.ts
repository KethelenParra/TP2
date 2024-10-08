import { Autor } from "./autor.model";
import { Editora } from "./editora.model";
import { Fornecedor } from "./fornecedor.model";
import { Genero } from "./genero.model";

export class Livro {
    id!: number;
    titulo!: string; 
    preco!: number;
    quantidadeEstoque!: number;
    isbn!: string;
    datalancamento!: Date;
    descricao!: string;
    classificacao!: string;
    fornecedor!: Fornecedor;
    editora!: Editora;
    autores!: Autor[];
    generos!: Genero[];
}
