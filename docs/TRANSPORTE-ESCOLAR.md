# Transporte Escolar — implementação local

## Escopo entregue

Evolução sobre o React/Vite existente, sem publicar na Vercel. Preservados integralmente os dados e componentes de Merenda e Limpeza. Apenas os contratos 05/2023, 07/2024, 43/2024 e 61/2025 foram cadastrados, com UUIDs internos; empresa, valores, vigência e escolas atendidas não foram presumidos.

O módulo tem duas perspectivas. O login existente continua regional/mock. A área escolar disponível ao regional é identificada como **prévia**, não como autenticação escolar real. O adaptador aceita um futuro perfil `{role: 'school', schoolId}` e restringe rotas, seleção, leitura e escrita à própria escola. O backend deve reforçar esse escopo com Auth/RLS antes de acesso real pelas unidades.

## Fluxo da escola

1. Transporte → Área da escola → selecionar a unidade na prévia regional. Com perfil escolar futuro a seleção vem da identidade, sem seletor de outras escolas.
2. Registrar nova ocorrência: contrato, CIE, data/horário, veículo, motorista, local, tipo, descrição e gravidade. Outros exige especificação.
3. Referência interna de estudante é opcional, restrita ao detalhamento. Não usar nome/diagnóstico neste ambiente mock. Descrições, referências do estudante e evidências não entram no CSV gerencial.
4. Anexar evidências; revisar os dados; confirmar envio. O salvamento gera UUID e protocolo TR-ANO-NNNN, seguido de mensagem de sucesso.
5. A ocorrência aparece imediatamente na área SEAFIN do mesmo navegador. Outras abas na mesma origem são atualizadas por BroadcastChannel. Não existe sincronização entre computadores.

O contrato indicado no formulário não confirma vínculo institucional. A tabela de vínculos é alimentada explicitamente pelo SEAFIN, evitando inferir quais escolas devem avaliar cada contrato.

## Tratamento SEAFIN

Tabela com protocolo, data, escola, contrato, tipo, veículo, gravidade original, status, responsável e tempo em aberto. Filtros próprios de período, escola, contrato, tipo, gravidade, status, veículo, motorista e busca por protocolo/tipo. Os filtros gerais do HUB são explicitamente separados para não esconder ocorrências recentes pela competência financeira de agosto.

Detalhamento inclui dados enviados, galeria de fotos/vídeos, download dos documentos e timeline. O SEAFIN pode registrar observação, providência, destinatário de encaminhamento, retorno da empresa, responsável, resolução e encerramento. Status avança no fluxo, podendo saltar etapas para resolver diretamente; não retrocede. Encerradas não podem ser reabertas nesta iteração. Mudança requer responsável e observação.

Gravidade da escola nunca é sobrescrita: a revisão tem campo separado. Histórico guarda status anterior/novo, data/hora, responsável, observação e ação. Controle de versão impede atualizar uma ocorrência com tela desatualizada.

## Evidências e armazenamento

Persistência local em IndexedDB `seafin-transporte-v1`, object stores `state` e `files`. A transação grava o registro, protocolo e arquivos atomicamente; não existe segunda tabela institucional de escolas. Protocolos são sequenciais por ano no navegador/origem e não são chaves primárias. A futura implantação multiusuário exige sequência transacional no servidor.

Aceitos JPEG, PNG, WebP e PDF até 10 MB; MP4 e WebM até 50 MB. Até 6 arquivos e 100 MB por ocorrência. A assinatura básica do formato é verificada além do MIME; isso não substitui análise antimalware no servidor. Metadados: UUID, nome, MIME, tamanho, data e SHA-256. URLs locais temporárias são revogadas ao desmontar a galeria.

O HUB não possui credenciais/conexão Supabase configuradas. O schema local existente foi consultado: `evidences` já permite `storage_path`/`external_url`; nenhuma criação de bucket foi encontrada nessa migration. Os buckets remotos **não foram inspecionados**, pois não há projeto remoto vinculado ao HUB. Não foi criado bucket nem enviado arquivo para serviço externo. Antes de conectar, listar buckets existentes e reutilizar um privado adequado, com URLs assinadas e política por ocorrência/escola.

## Avaliação mensal

O SEAFIN cadastra vínculos escola/contrato com CIE, competência inicial e final opcional; configura critérios nomeados com escala numérica. Nenhum critério foi inventado como regra institucional. Critérios podem ser ativados/desativados, e cada envio guarda a versão usada.

Abertura: último dia do mês menos cinco dias corridos (agosto/2026: dia 26; fevereiro/2026: dia 23). Prazo: último dia do mês; após ele o primeiro envio é em atraso. Calendário em America/Sao_Paulo. Confirmar essa interpretação com a regra administrativa caso a intenção seja janela de cinco dias inclusivos ou dias úteis.

Uma avaliação por escola + contrato + competência. Antes da abertura o envio é recusado, inclusive na camada de domínio. Primeiro envio registra pontualidade. O SEAFIN pode solicitar correção, revisar ou validar. Reenvio só é permitido em Necessita correção, mantendo UUID, primeiro envio, pontualidade e histórico. Avaliações sem vínculo/critério não são presumidas. A abertura é calculada sem precisar de agendamento ou inserção antecipada de linhas.

## Indicadores, relatórios e recorrências

Relatórios por data do fato, com limites inclusivos. Avaliações cobrem as competências tocadas pelo período, somente escola/contrato: filtros de veículo, motorista e tipo não são aplicáveis às avaliações. Relatório é um snapshot ao clicar Gerar; para atualizar, gerar novamente. Períodos de avaliações limitados a 120 meses, com aviso explícito.

Contagens por contrato/escola/tipo/gravidade/status, abertas, resolvidas e tempo médio entre criação e resolução. Avaliações esperadas derivam de vínculos; entrega não calculável sem denominador. Média normalizada em 0–100 somente com mesmos critérios/escalas; não comparar critérios distintos. Pontualidade do primeiro envio é separada do status atual de revisão.

Gráficos de barras com valores legíveis, evolução diária/mensal e avaliações. Recorrências são contagens absolutas em janela temporal, ordenadas por identificação, não rankings. Alertas de gravidade alta, sem atendimento e tempo em aberto; limites configuráveis. Defaults locais 2/7 dias e 3 ocorrências em 30 dias são parâmetros de demonstração, não cláusulas contratuais.

Exportação CSV de ocorrências e avaliações, com proteção contra fórmulas em células. Impressão usa layout dedicado e permite Salvar como PDF pelo navegador. Exportação XLSX e PDF gerado no servidor não foram introduzidos. Não há conclusões automáticas de culpa ou responsabilidade.

## Rotas

Todas sob `/painel/transporte`:

- `/`: painel SEAFIN.
- `/escola`: seletor da prévia regional.
- `/escola/:schoolId`: histórico e registro da unidade.
- `/escola/:schoolId/ocorrencias/:id`: acompanhamento escolar.
- `/ocorrencias/:id`: detalhamento e tratamento SEAFIN.
- `/escola/:schoolId/avaliacoes`: envio escolar.
- `/avaliacoes`: revisão SEAFIN, filtro por contrato.
- `/contratos/:contractId`: página de cada contrato, com vínculo, ocorrências, evolução e avaliações relacionadas.
- `/relatorios`: relatório por período e exportação.
- `/configuracoes`: vínculos, critérios e limites.

## Componentes e integração

TransportProvider, TransportLayout, ManagerOnly, TransportDashboard, TransportFilters, SchoolTransport, OccurrenceForm, OccurrenceDetail/Evidence, Evaluations, TransportSettings, TransportReports, Bars e DownloadCSV. Domínio puro em `domain.js`; persistência/arquivos em `repository.js`, isolados para substituição por API. Visão geral e ficha da escola leem o mesmo estado de ocorrências de Transporte, sem cópias dos registros.

## Banco e futura integração

Nenhuma migration SQL executada/criada e nenhuma tabela remota criada. Esta entrega funciona localmente. Reutilizados o catálogo institucional de escolas e AuthContext existentes. Estruturas identificadas no schema do SuperBI360 para reutilização futura: organizations, schools, profiles, institutional_profiles, institutional_items, institutional_item_history, evidences e data_sources. Não afirmar que estão conectadas em runtime.

Proposta após conferência do schema remoto atualizado:

- Contratos de transporte com UUID, organização, número único; campos adicionais nulos até receber fonte.
- Ocorrências com UUID, protocolo único por organização/ano, FK para schools e contrato. Índices propostos (organization_id, school_id, date), (organization_id, contract_id, date), (organization_id, status, date).
- Histórico reutilizando estrutura institucional quando compatível; índice (occurrence_id, created_at).
- Evidências reutilizando estrutura existente, vínculo por occurrence_id e path privado.
- Vínculos escola/contrato por competência; unicidade e intervalos sem sobreposição.
- Avaliações com unique (organization_id, school_id, contract_id, competencia), índice por contrato/competência e escola/competência.
- Critérios versionados e respostas vinculadas, sem nova coluna por critério.
- RLS: escola lê/cria apenas seu school_id; não atualiza tratamento SEAFIN; revisão apenas pelo setor/regional. Identidade e escola vêm de auth.uid()/profiles, nunca de parâmetro da URL ou corpo enviado pelo cliente.

## Validação e decisões pendentes

Lint, typecheck, testes de domínio e armazenamento em IndexedDB simulado, build e revisão de interface. Testes usam dados somente em memória, sem popular ocorrências fictícias no navegador do usuário.

Ainda dependem de informação: vínculos reais e CIEs; critérios/escalas oficiais; regra de calendário; limites de alertas; identificação do Supabase institucional e bucket privado; perfis escolares reais; política de retenção e tratamento das evidências; detalhes das empresas e contratos. O modo atual não deve ser tratado como segurança suficiente para dados sensíveis reais.
