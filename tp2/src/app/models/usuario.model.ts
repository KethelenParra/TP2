import { Sexo } from "./sexo.model";
import { Telefone } from "./telefone.model";

export class Usuario {
    id!: number;
    nome?: string;
    username?: string;
    email?: string;
    dataNascimento?: string; 
    telefone?: Telefone;
    cpf?: string;
    sexo?: Sexo;
    senha?: string;
    ativo?: boolean;
  }
