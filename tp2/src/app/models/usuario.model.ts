export interface Usuario {
    id: number;
    nome: string;
    username: string;
    email?: string; // Opcional
    dataNascimento?: string; // ISO format (string)
    cpf?: string;
    sexo?: string;
    senha?: string;
  }
