<div align="center">
  <h1>📝 Gerenciador de Postagens — CRUD React</h1>
  <p><strong>Projeto front-end para criar, consultar, editar e excluir postagens por meio de uma API REST.</strong></p>
  <p><img alt="React 18" src="https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white"> <img alt="Status" src="https://img.shields.io/badge/status-desafio%20t%C3%A9cnico-64748b"></p>
</div>

## Visão geral

Este desafio demonstra o uso de **React Router e Axios** para implementar telas de listagem, detalhes, cadastro, edição e exclusão. É um experimento de integração de frontend com API externa, não uma plataforma completa para publicação de conteúdo.

| Rota no código | Finalidade |
| --- | --- |
| `/` | Lista de postagens |
| `/cadastro` | Criar nova postagem |
| `/detalhes/:id` | Ver detalhes |
| `/editar/:id` | Editar |
| `/excluir/:id` | Confirmar exclusão |

O trabalho foi criado com base em um [protótipo externo de referência](https://cback.pt/vaga/index.html); a disponibilidade desse endereço pode ter mudado.

## Executar localmente

```bash
git clone https://github.com/HelioConde/Projeto_CRUD.git
cd Projeto_CRUD
npm install
npm start
```

Abra o endereço indicado pelo Create React App (normalmente `http://localhost:3000`). Para tentar um build estático: `npm run build`.

### Configuração da API

A aplicação usa componentes em `src/pages/` e um arquivo `src/pages/apiConfig.jsx` para a integração. **A API, suas credenciais e permissões devem ser configuradas pelo desenvolvedor**; sem um serviço compatível, as ações de CRUD não estarão operacionais.

> **Segurança:** não envie `apiAuthorizationToken`, `userToken`, credenciais de administração ou tokens privados para o repositório. Credenciais sensíveis não podem ser protegidas apenas por variáveis embutidas no bundle React. Use um backend intermediário e permissões mínimas para um serviço público.

## Estrutura

```text
src/
  App.js                         Definição das rotas
  pages/
    ListaDePostagens.jsx         Listagem
    FormularioCadastro.jsx       Criação
    DetalhesDaPostagem.jsx       Detalhes
    EdicaoDePostagem.jsx         Edição
    ExcluirPostagem.jsx          Exclusão
    apiConfig.jsx                Integração
public/                          Arquivos estáticos
```

## Evolução sugerida

- Substituir credenciais de exemplo por um backend de testes seguro.
- Tratar erros de rede, sessão expirada, loading e formulários inválidos.
- Adicionar testes de navegação/CRUD e verificar teclado, mobile e acessibilidade.
- Atualizar dependências do Create React App quando o projeto for retomado.

**Projeto histórico de portfólio — [Hélio Conde](https://github.com/HelioConde).**
