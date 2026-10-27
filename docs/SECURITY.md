# Modelo de segurança

Este frontend é um exemplo didático. No modo padrão, os dados ficam no armazenamento local; não utilize para informações confidenciais.

## Proteções implementadas
- Não existem chaves de administração ou bearer tokens no bundle.
- Um clique de confirmação é obrigatório antes de exclusões; navegação GET nunca dispara DELETE.
- URLs de vídeo são validadas para protocolos http/https. O React escapa o texto exibido.
- O adaptador HTTP exige a mesma origem, usa cookies de sessão do navegador, normaliza erros e não registra informações confidenciais.
- É possível cancelar carregamentos em progresso ao sair das telas.

## Responsabilidades do backend real
- Autenticar usuários com sessão segura (cookies HttpOnly, Secure e SameSite) e aplicar proteção CSRF quando necessário.
- Autorizar leitura e cada operação de escrita por usuário e por registro.
- Validar conteúdo, tamanho e URLs, paginar e aplicar limites de taxa.
- Armazenar dados de forma confiável e manter backup, auditoria e política de retenção.
- Manter tokens/chaves somente no servidor, nunca em `VITE_*` nem em `localStorage`.

O demo local não oferece isolamento entre usuários do mesmo navegador e não é uma solução de produção multiusuário.
