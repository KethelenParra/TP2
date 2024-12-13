import { Usuario } from './usuario.model';

export class Cliente {
  id!: number;
  usuario!: Usuario;
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  listaDesejoBox?: number[];
  tipo?: 'cliente';
}