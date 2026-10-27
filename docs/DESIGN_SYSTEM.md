# PostFlow — Design System

## Princípios
- Clareza antes da decoração: o título, o status e as ações principais devem ser encontrados rapidamente.
- Desktop com aproveitamento da altura útil, sem obrigar a página inteira a crescer por causa da tabela.
- Telas pequenas com rolagem natural; a tabela tem uma região de rolagem horizontal nomeada para tecnologia assistiva.
- Componentes reutilizáveis e navegação sempre possível por teclado.

## Tokens (src/styles.css)
| Categoria | Valor |
| --- | --- |
| Fundo | `#f6f8fc` |
| Superfície | `#fff` |
| Cor de destaque | `#3568ed` |
| Destaque ao passar o mouse | `#2455d2` |
| Texto | `#202940` |
| Texto secundário | `#75819a` |
| Borda | `#e6eaf1` |
| Raio dos painéis | `14px` |
| Foco visível | contorno sólido de 3px em `#779dfa` |
| Fonte do corpo | DM Sans, fallback do sistema |
| Fonte de títulos | Plus Jakarta Sans, fallback do sistema |

## Componentes
- **Botões:** primário para salvar/criar, secundário para cancelar, destrutivo para excluir.
- **PostTable:** tabela semântica, cabeçalhos com escopo, botões com nomes acessíveis.
- **SearchInput:** campo com rótulo e ação para limpar.
- **PostForm:** campos associados a labels, erros em linha, pré-visualização e estado de envio.
- **ConfirmDialog:** `<dialog>` modal nativo com foco inicial no botão Cancelar, tecla Escape e devolução do foco ao fechar.
- **Status:** publicado e rascunho comunicados por texto, não apenas cores.
- **Feedback:** alertas de erro e região `role=status` para sucesso.

## Breakpoints
- 1050px: reduzir espaços e proporção da coluna lateral.
- 760px: barra de navegação em segunda linha, formulários em coluna única e tabela rolável.
- 385px: simplificar indicador de modo, preservar ações.
- Movimento reduzido respeitado com `prefers-reduced-motion`.

## Critérios de aceite
- Navegação completa pelo teclado, inclusive fechamento do diálogo com Escape.
- Nenhuma ação destrutiva em GET, efeito de montagem ou mudança de rota.
- Leitura e operação em celular de 320px, 760px, desktop 1280px e 200% de zoom.
- Mensagens claras para ausência de dados, carregamento, API indisponível e falhas de salvamento.
- Avaliação automática com axe é complementar à revisão manual de acessibilidade.
