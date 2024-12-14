export interface CadastroBasicoDTO {
    nome: string;
    email: string;
    username: string;
    cpf: string;
    senha: string;
    idSexo: number;
    cep?: string;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  }