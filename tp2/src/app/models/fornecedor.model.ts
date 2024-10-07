import { Telefone } from "./telefone.model";

export class Fornecedor {
    id!: number;
    nome!: string;
    cnpj!: string;
    inscricaoEstadual!: string;
    email!: string;
    quantLivrosFornecido!: number;
    telefone!: Telefone;
    estado!: string;
    cidade!: string;
}
