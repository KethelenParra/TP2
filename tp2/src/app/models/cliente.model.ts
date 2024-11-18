import { Usuario } from './usuario.model';

export interface Cliente {
  id: number;
  usuario: Usuario;
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  listaDesejo?: number[]; // IDs dos livros na lista de desejo
}