export const modules = { merenda: 'Merenda', limpeza: 'Limpeza', transporte: 'Transporte Escolar', cuidador: 'Cuidador' };
export const stages = ['Solicitação recebida', 'Documentação em análise', 'Pendência documental', 'Encaminhado', 'Aguardando providência externa', 'Atendimento autorizado', 'Cuidador disponibilizado', 'Em acompanhamento', 'Concluído'];
export const statuses = ['Aberta', 'Em análise', 'Aguardando escola', 'Aguardando empresa', 'Aguardando órgão externo', 'Em andamento', 'Resolvida'];
export const alertStatuses = ['Identificado', 'Em análise', 'Regularizado', 'Justificado'];
export const money = cents => cents == null ? 'Não informado' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
export const month = value => value ? `${value.slice(5)}/${value.slice(0, 4)}` : 'Não informada';
export const finished = item => item.status === 'Resolvida' || item.stage === 'Concluído';
export function filterItems(items, filters) {
  return items.filter(item => (!filters.module || item.module === filters.module || item.categoria === filters.module) && (!filters.school || item.schoolId === filters.school) && (!filters.period || item.competencia === filters.period) && (!filters.status || item.status === filters.status || item.stage === filters.status));
}
export function evidenceUrl(value) {
  if (!value) return '';
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
export function operationalAlerts(items, today = new Date().toISOString().slice(0, 10)) {
  return items.filter(item => !finished(item) && item.deadline && item.deadline < today).map(item => ({ id: `deadline-${item.id}`, module: item.module, competencia: item.competencia, schoolId: item.schoolId, title: 'Prazo vencido', detail: `${item.title} · prazo ${item.deadline}`, source: 'Registro operacional local', itemId: item.id }));
}
export function saveRecord(items, draft, actor, now = new Date().toISOString()) {
  if (!draft.title?.trim()) throw new Error('Informe o assunto.');
  if (evidenceUrl(draft.evidence) === null) throw new Error('A evidência deve ser um endereço HTTP ou HTTPS válido.');
  const old = items.find(item => item.id === draft.id);
  const snapshot = Object.fromEntries(Object.entries(draft).filter(([key]) => key !== 'history'));
  const record = { ...draft, id: old?.id || crypto.randomUUID(), createdAt: old?.createdAt || now, updatedAt: now,
    history: [...(old?.history || []), { at: now, actor, action: old ? 'Atualização' : 'Criação', status: draft.status, stage: draft.kind === 'processo' ? draft.stage : null, nextAction: draft.nextAction, description: draft.description, evidence: draft.evidence, snapshot }] };
  return old ? items.map(item => item.id === old.id ? record : item) : [...items, record];
}
