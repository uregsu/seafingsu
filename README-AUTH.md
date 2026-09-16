# HUB SEAFIN — autenticação de demonstração

Implementação React + Vite + Tailwind v4, adaptada ao painel existente.

## Estrutura

```text
src/
  services/authService.js
  contexts/AuthContext.jsx
  components/ProtectedRoute.jsx
  pages/Login.jsx
  pages/Dashboard.jsx
  App.jsx
  main.jsx
  index.css
vercel.json
```

Execute `npm install` e `npm run dev` nesta pasta para visualizar a cópia.
Execute `npm run build` para gerar a distribuição.

O usuário e senha são comparados exatamente, sem remover espaços ou alterar maiúsculas.
O serviço não persiste a senha. Somente o usuário e token simulado são armazenados em sessionStorage.
Falha ao gravar a sessão impede o login. JSON inválido é tratado como sessão ausente.
Sair remove a sessão e desmonta o painel. O carregamento inicial lê a sessão antes de renderizar as rotas.
O redirecionamento pós-login aceita somente caminhos internos de /painel.
vercel.json permite abrir /login e /painel diretamente em hospedagem SPA na Vercel.

## Limites de segurança

Este mock NÃO protege dados reais nem estabelece conformidade com a LGPD.
A senha está no bundle e o token pode ser forjado pelo navegador.
O painel original contém nomes e diagnósticos de alunos diretamente no código.
Esses dados permanecem no bundle público mesmo com ProtectedRoute. Não publique esta cópia com esses dados.
Em produção, retire dados sensíveis do frontend e use uma API autenticada com autorização por usuário.
Com Supabase, implemente Auth e políticas RLS nas tabelas antes de conectar dados reais.
Substitua authenticate/readSession/saveSession/clearSession pela integração e sincronize o contexto com os eventos de sessão do provedor.
Use identidades individuais e substitua a senha compartilhada para produção.

sessionStorage sobrevive ao recarregamento e normalmente é descartado quando a aba fecha.
Restauração ou duplicação de abas pode preservar/copiar a sessão conforme o navegador.
Não é um mecanismo de revogação no servidor e não resiste a XSS.

## Aplicar ao projeto original

Esta entrega é uma cópia separada. A sessão não tem permissão para editar C:\Users\Administrador\hub-seafin.
Faça backup do projeto original. Copie o conteúdo de src desta entrega para src do projeto original,
e copie vercel.json para a raiz, revisando regras existentes caso esse arquivo já exista.
As dependências necessárias já constavam no package.json original.
Nenhum deploy foi realizado.

## Verificação manual

1. Sem sessão, abra /painel: deve ir a /login.
2. Envie credenciais incorretas: mensagem vermelha e nenhum acesso ao painel.
3. Teste mostrar/ocultar senha e navegação por teclado.
4. Use as credenciais solicitadas: deve abrir /painel.
5. Recarregue: a sessão deve permanecer.
6. Clique Sair e tente voltar pelo histórico: o painel deve continuar bloqueado.
7. Verifique em largura de 375px e com sessionStorage indisponível.

Referências: https://reactrouter.com/start/declarative/routing
e https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
