import { Telefone } from "./telefone.model";

export class Editora {
    id!: number;
    nome!: string;
    email!: string;
    telefone!: Telefone;
    estado!: string;
    cidade!: string;
}
