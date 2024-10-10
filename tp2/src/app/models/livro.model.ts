import { Autor } from "./autor.model";
import { Editora } from "./editora.model";
import { Fornecedor } from "./fornecedor.model";
import { Genero } from "./genero.model";

export class Livro {
    id!: number;
    titulo!: string; 
    quantidadeEstoque!: number;
    preco!: number;
    isbn!: string;
    descricao!: string;
    classificacao!: string;
    editora!: Editora;
    fornecedor!: Fornecedor;
    // datalancamento!: Date;
    // autores!: Autor[];
    // generos!: Genero[];
}
