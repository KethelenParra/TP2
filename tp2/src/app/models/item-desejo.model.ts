import { Autor } from "./autor.model";

export interface ItemDesejo {
    id: number; // ID do item (Livro ou Box)
    nome: string; // Nome do Livro ou Box
    tipo: 'Livro' | 'Box'; // Tipo do item
    autores?: Autor[]; // Lista de autores, opcional
    imagemUrl?: string; // URL da imagem do item, opcional
  }
  