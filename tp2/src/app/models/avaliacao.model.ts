export interface Avaliacao {
    id: number;
    comentario: string;
    dataAvaliacao: string; // Ex: '2024-12-10'
    estrela: {
      id: number; // Deve ser um número sempre
      label: string; // Exemplo: ⭐⭐⭐⭐
    };
    cliente: {
      id: number;
      username: string;
      email: string;
    };
  }
  