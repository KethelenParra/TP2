
export interface CadastroBasicoDTO {
    nome: string;
    email: string;
    username: string;
    cpf: string;
    senha: string;
    idSexo: number;
    telefone: {
        codigoArea: string;
        numero: string;
    };
    cep?: string;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  }