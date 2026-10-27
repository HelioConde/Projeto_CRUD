<div align="center">

# ✦ PostFlow

**Gerenciador de postagens moderno, acessível e responsivo em React + Vite.**

![React](https://img.shields.io/badge/React-18-149eca?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)
![Playwright](https://img.shields.io/badge/QA-Playwright-2eaa53?logo=playwright)
![Demo](https://img.shields.io/badge/modo-demo%20local-3568ed)

</div>

## Visão geral

Evolução de um desafio técnico CRUD para um pequeno **CMS (Content Management System)**. O projeto permite **criar, consultar, editar e excluir** postagens, trabalhar com rascunhos e publicações, pesquisar e filtrar. A aparência foi refeita com um design system compartilhado.

**[Abrir a demonstração no GitHub Pages](https://helioconde.github.io/Projeto_CRUD/)** — depende do workflow de implantação e das configurações de Pages estarem ativados no repositório.

> **Demonstração:** por padrão os dados ficam no `localStorage` deste navegador. Eles não são compartilhados, não são um banco de dados, não usam autenticação e podem ser apagados pelas configurações do navegador. Dados de exemplo são fictícios. Use o botão **Restaurar exemplos** para recomeçar.

## Funcionalidades

- CRUD completo no navegador com persistência local, incluindo 12 registros de exemplo.
- Proteção contra exclusão acidental: **a rota `/excluir/:id` abre apenas uma confirmação**, nunca dispara `DELETE` sozinha.
- Tabela com busca, filtro de status, ordenação e paginação.
- Cadastro e edição com campos agrupados, validação, pré-visualização, status de rascunho/publicado e campos SEO.
- Proteção contra sair do formulário com alterações pendentes; estados de carregamento, mensagens de falha e tentativa novamente.
- Layout desktop/mobile, navegação por teclado, foco visível, nomes acessíveis e movimento reduzido.
- Integração opcional com um backend **same-origin**, sem credenciais embutidas no JavaScript.

## Executar no seu computador

Requer Node.js 22+.

```bash
git clone https://github.com/HelioConde/Projeto_CRUD.git
cd Projeto_CRUD
npm install
npm run dev
```

O Vite informa a URL local (normalmente `http://127.0.0.1:5173`). Use `npm run build` para compilar e `npm run preview` para conferir o build.

## URLs e GitHub Pages

Rotas lógicas:
| Rota | Função |
| --- | --- |
| `/` | Lista de postagens |
| `/cadastro` | Nova postagem |
| `/detalhes/:id` | Detalhes |
| `/editar/:id` | Editar |
| `/excluir/:id` | Confirmação de exclusão |

As URLs públicas usam o **HashRouter** para preservar a navegação nas hospedagens estáticas, sem erros 404 ao recarregar. Exemplo: `https://helioconde.github.io/Projeto_CRUD/#/cadastro`.

O workflow `.github/workflows/pages.yml` publica a pasta `dist/` quando houver push na `main`. Na aba **Settings → Pages**, selecione **GitHub Actions** como origem da publicação. É necessário que Pages esteja habilitado no repositório.

## Integração real com API e segurança

O padrão é o modo de demonstração. Para usar um servidor, crie `.env.local`:

```dotenv
VITE_API_BASE_URL=/api
```

A aplicação faz `GET /posts`, `GET /posts/:id`, `POST /posts`, `PUT /posts/:id` e `DELETE /posts/:id`, espera JSON (objeto direto ou `{ "data": ... }`) e trata respostas HTTP de erro.

**Importante:** o frontend NÃO cria usuários, autenticação, banco de dados ou autorização. Um backend real precisa implementar autenticação com sessão HttpOnly/Secure/SameSite, proteção CSRF quando apropriado, autorização por recurso e validação no servidor. A URL configurada precisa ter a mesma origem da aplicação; **nunca coloque segredos em variáveis `VITE_*`**. Um deploy puramente estático não pode oferecer um CMS multiusuário seguro por conta própria.

## Estrutura

```text
src/
  App.jsx                  Layout, mensagens e roteamento
  components/              SearchInput, PostTable, PostForm, ConfirmDialog
  pages/                   Listagem, editor, detalhes
  demo/posts.js            Registros fictícios
  lib/postsRepository.js   Repositório local ou API HTTP
  lib/format.js            Datas e status
  styles.css               Tokens, UI e breakpoints
docs/DESIGN_SYSTEM.md      Padrões visuais e de acessibilidade
tests/crud.spec.js         Fluxos E2E, layout e axe
.github/workflows/         CI e publicação estática
```

## Qualidade e testes

```bash
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

Os testes cobrem fluxos CRUD, confirmação/cancelamento de exclusão, pesquisa, filtros, paginação, dados corrompidos, navegação protegida, responsividade e auditoria axe de acessibilidade. O CI salva relatórios e screenshots como artefatos no GitHub Actions. **Os testes E2E não substituem a inspeção manual em dispositivos e leitores de tela.**

## Origem

O projeto começou como desafio técnico de React + API externa; esta versão mantém os caminhos e campos principais e prioriza uma demonstração independente da API histórica.

**Desenvolvido por [Hélio Conde](https://github.com/HelioConde).**
