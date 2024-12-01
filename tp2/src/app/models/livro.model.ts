import { Autor } from "./autor.model";
import { Classificacao } from "./classificacao.model";
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
    datalancamento!: Date;
    classificacao!: Classificacao;
    editora!: Editora;
    fornecedor!: Fornecedor;
    autores!: Autor[];
    generos!: Genero[];
    nomeImagem!: string;
}
