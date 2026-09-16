# SEAFIN — evolução operacional local

## Estado encontrado e preservação

A aplicação era React/Vite/Tailwind v4 com autenticação mock, token em sessionStorage, rotas protegidas e dados JSON locais. A configuração local do HUB não contém conexão Supabase. Não houve inspeção do banco remoto nem alteração em módulos externos.

Preservados Login, AuthContext, ProtectedRoute e FiscalizacaoContratos. Mantidos todos os valores, fontes e hashes de limpeza (julho/agosto de 2026) e merenda (agosto de 2026). O JSON continua com três registros e oito fontes, sendo cinco cópias redundantes. A diferença de julho permanece no registro original: 82 finalizadas e 82 sem resposta. Sua análise gerencial tem histórico separado e não reescreve a origem.

Os antigos exemplos de transporte com nomes/diagnósticos e os dados de limpeza por escola sem fonte validada foram retirados do bundle ativo. A cópia anterior foi preservada fora da pasta servida pelo Vite. Transporte agora apresenta o estado vazio solicitado.

## Rotas e componentes

- /painel: Overview, visão executiva e cards dos quatro módulos.
- /painel/merenda e /painel/limpeza: ServiceModule + FiscalizacaoContratos, evolução mensal e ocorrências.
- /painel/transporte: estrutura do módulo e ocorrências, sem dados de rotas inventados.
- /painel/cuidador: processos locais, etapas configuráveis e indicadores de tramitação.
- /painel/escolas e /painel/escolas/:schoolId: Schools, cadastro pesquisável e ficha transversal.
- /painel/pendencias e /painel/ocorrencias: Operations, criação, atualização, filtros, evidências por URL e histórico.
- /painel/alertas: Alerts, divergência da fonte e prazos vencidos reais, análise e justificativa persistentes.
- /painel/fontes: Sources, arquivos, competência, quantidade, transformações e hashes.

Dashboard é agora o layout compartilhado com navegação responsiva. SeafinProvider centraliza filtros e persistência operacional. SeafinUI contém PageTitle, Metric e Empty. Etapas, módulos e estados ficam em src/data/operations.js. Modelos futuros de transporte, cuidador e permissões estão em src/data/models.ts.

## Dados e datas

Valores em centavos; fontes agrupadas sem somar arquivos duplicados. Filtros de escola não atribuem valores regionais a escolas. CIE ausente continua nulo. As 82 escolas do cadastro não comprovam a cobertura individual dos contratos. Valores médios por escola não são presumidos. Atividade/vigência contratual não é inferida do status Finalizado.

A data da importação histórica não foi registrada na versão anterior e é exibida como não informada. Não foi inventada a partir da data de modificação de arquivos. O serviço mergeCompetencias registra importedAt em novas competências, mantém as anteriores, agrega fontes idênticas e devolve conflitos para revisão sem substituir valores. O serviço está preparado para uso pela futura rotina de importação; não há upload automático de novas planilhas nesta iteração.

Evolução mensal é calculada a partir das competências presentes no JSON e cresce com novos registros. As barras incluem valores textuais acessíveis. O histórico regional completo é explicitamente identificado quando filtros individuais estão ativos.

## Cadastro institucional e Supabase

Fonte reutilizada: config/schools.ts do SuperBI360, contendo 82 escolas. O adaptador src/data/escolas.json conserva id, nome e slug, com hash e data de sincronização. É um snapshot de leitura, não um novo cadastro editável. A futura API deve resolver internal_code para public.schools.id, sem converter os códigos school-NNN em UUIDs por suposição.

Schema local analisado: supabase/migrations/20260731000100_radar360_schema.sql. Já declara organizations, sectors, schools, profiles, institutional_profiles, institutional_items, institutional_item_history, institutional_item_comments, evidences, data_sources e audit_logs. Nenhuma tabela remota foi reutilizada em runtime nesta etapa; o cadastro local institucional foi reutilizado.

Mapeamento proposto para a próxima etapa:

| Necessidade | Entidade institucional existente / extensão proposta |
|---|---|
| Escolas | public.schools; não criar seafin_escolas |
| Usuários/perfis | auth.users, profiles, institutional_profiles |
| Setor e organização | sectors, organizations |
| Pendências e ocorrências | institutional_items, com categoria e setor SEAFIN |
| Histórico e observações | institutional_item_history, institutional_item_comments |
| Evidências | evidences; armazenamento privado após autenticação real |
| Origem | data_sources + eventual extensão para arquivo/hash/linha |
| Competências financeiras | proposta seafin_contract_periods, única por organização/UG/processo/contrato/competência |
| Contratos | proposta seafin_contracts; validar reutilização no schema remoto atual antes de criar |
| Cuidador | institutional_items como demanda, com extensão de campos de processo somente se necessária |
| Transporte | extensão de rotas/competências após receber fonte autorizada |

Não foi criada migration: esta iteração não requer mudanças de banco. Antes de implementá-las, comparar o schema remoto atual, confirmar projeto Supabase, escopo organizacional e regras RLS. O enum existente não possui SEAFIN como papel; representar o setor usando sector_id antes de propor outro perfil. Authorization precisa ser validada no servidor, não apenas nos filtros do cliente.

## Persistência e limites

Pendências, ocorrências, processos e análises usam localStorage sob seafin:operations:v1. O login continua em sessionStorage. Falhas de leitura bloqueiam gravação para não sobrescrever dados corrompidos. Falhas de armazenamento são apresentadas e não confirmam salvamento. Evidências aceitam somente HTTP/HTTPS, sem upload de documentos.

Este modo é local e não multiusuário: não tem sincronização entre navegadores, controle de concorrência entre abas ou auditoria inviolável. Não registrar dados pessoais sensíveis. Autenticação e permissões efetivas continuam pendentes da integração Supabase. A aplicação avisa isso na interface.

## Validação

- npm run lint: enumera explicitamente arquivos, pois o diretório outputs é ignorado pelo repositório pai.
- npm run typecheck: TypeScript com allowJs/checkJs para verificar JS/JSX e contratos TS; strict desativado para compatibilidade com o código JS existente.
- npm test: testes de preservação financeira, filtros, histórico, protocolos de evidência, prazos, idempotência, conflito e nova competência.
- npm run build: distribuição Vite.
- Navegador: login, total de agosto, alerta de julho e ausência de merenda em julho; revisão de viewport mobile.

## Pendências reais

Conectar Supabase/Auth/RLS; sincronizar catálogo por API; receber CIEs e relatórios por escola; confirmar a divergência de julho; receber fontes de transporte e cuidador; confirmar escopo financeiro antes de calcular médias; definir critérios de contrato a vencer e processo parado. Não há alertas artificiais para esses casos sem dados ou critérios. Publicação não faz parte desta alteração local.
