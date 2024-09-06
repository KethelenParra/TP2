# Anotações essenciais sobre o repositório

### Diferencial no Sistema - To Do

<<<<<<< HEAD
 [x] Implementação de um API para o CEP
 [x] Avaliação com estrela 
 [x] Avaliação com comentários
 [] Pagamento com Pix - API gerador de QR code
 [] Pagamento com Boleto 
 [] Notificação com codigos promocionais
 [] Notificação de livros adicionados no ecommerce --> Último caso
=======
- [x] Implementação de um API para o CEP
- [x] Avaliação com estrela 
- [x] Avaliação com comentários
- [] Pagamento com Pix - API gerador de QR code
- [] Pagamento com Boleto 
- [] Notificação com codigos promocionais
- [] Notificação de livros adicionados no ecommerce --> Último caso
>>>>>>> 3cb8529c5780de6413040aa7895efbd66638aeec

### Comandos básicos
- Para criar uma novo projeto angular: `ng new <nome_projeto>`
- Para criar um novo component: `ng g c component <caminho\do_component>`
- Para criar uma nova classe: `ng g class <nome_classe>`
- Para criar um novo módulo `ng g m <nome_modulo>`

### Estrutura de um projeto angular
- **src**: Pasta principal do projeto, onde estão os arquivos de código fonte.
- **app**: Contém a aplicação principal e todos os seus componentes
    - Arquivos .spec.ts, é o arquivo de testes unitários
- **assets**: Conterá todas as imagens, ícones, vídeos
- **Component**: Pasta que armazena os arquivos do componente principal.
    - **app.component.css**: Estilo CSS específico para o componente AppComponent.
    - **app.component.html**: Template HTML específico para o componente AppComponent.
    - **app.component.spec.ts**: Arquivo de testes unitários para o componente AppComponent.
    - **app.component.ts**: Arquivo TypeScript que define o AppComponent, incluindo a lógica do componente e sua integração com o template.
    - **app.config.ts**: Arquivo destinado a definir configurações específicas da aplicação, como constantes, configurações de ambiente ou outros parâmetros globais.
    - **app.routes.ts**: Arquivo gerências as rotas de aplicação, definindo como diferentes URLs correspondem a componentes específicos
- **index.html**: O arquivo HTML principal da aplicação, que carrega o aplicativo Angular e injeta o AppComponent.
- **main.ts**: O ponto de entrada da aplicação Angular. Este arquivo inicializa a aplicação Angular, carregando o AppModule (módulo principal).
- **styles.css**: Arquivo de estilos globais da aplicação.
- **angular.json**: Arquivo de configuração da Angular CLI, que define como a aplicação é compilada e servida. Inclui configurações de projetos, scripts, estilos e muito mais.

### Anotações Diversas
- **Processo de bootstrap**: Um processo de build seria pegar todos os components, todos os código do projeto, e transformar em um código que o navegador consiga ler
