import { Usuario } from './usuario.model';

export interface Funcionario {
  id: number;
  usuario: Usuario;
  salario?: number;
  cargo?: string;
}