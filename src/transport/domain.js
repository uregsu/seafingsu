export const CONTRACTS = [
  { id: '563089db-8a13-4c8a-a79b-1a66f93c8201', number: '05/2023' },
  { id: '563089db-8a13-4c8a-a79b-1a66f93c8202', number: '07/2024' },
  { id: '563089db-8a13-4c8a-a79b-1a66f93c8203', number: '43/2024' },
  { id: '563089db-8a13-4c8a-a79b-1a66f93c8204', number: '61/2025' },
];
export const TYPES = ['Atraso','Falta do veículo','Veículo quebrado','Conduta inadequada do motorista','Superlotação','Falta de cinto de segurança','Problema de acessibilidade','Falta de limpeza','Outros'];
export const STATUSES = ['Aberta','Em análise','Encaminhada','Em atendimento','Resolvida','Encerrada'];
export const SEVERITIES = { Baixo: 'Ocorrência pontual sem interrupção relevante do serviço.', Médio: 'Prejudica o serviço ou apresenta reincidência.', Alto: 'Risco, segurança, ausência do serviço ou impacto significativo aos estudantes.' };
export const REVIEW_STATUSES = ['Em revisão','Necessita correção','Validada'];
export const today = () => new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo'}).format(new Date());
export const terminal = r => ['Resolvida','Encerrada'].includes(r.status);
export const initialState = () => ({ version:1, occurrences:[], evaluations:[], assignments:[], criteria:[], sequences:{}, settings:{unattendedDays:2,openDays:7,recurrenceCount:3,recurrenceDays:30}, configurationHistory:[] });
export function assertSchool(actor, schoolId) {
  if (!actor || !['seafin','school'].includes(actor.role) || (actor.role==='school' && (!actor.schoolId || actor.schoolId!==schoolId))) throw Error('Acesso não autorizado para esta escola.');
}
export function assertManager(actor) { if (actor?.role!=='seafin') throw Error('Ação exclusiva do SEAFIN.'); }
export function scoped(rows, actor) { return actor?.role==='seafin' ? rows : actor?.role==='school' && actor.schoolId ? rows.filter(r=>r.schoolId===actor.schoolId) : []; }
export function validMonth(month) { return /^\d{4}-(0[1-9]|1[0-2])$/.test(month || ''); }
export function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0,10)===value; }
export function evaluationWindow(month) {
  if (!validMonth(month)) throw Error('Competência inválida.');
  const [year,m]=month.split('-').map(Number);
  const last=new Date(Date.UTC(year,m,0));
  const open=new Date(last);open.setUTCDate(last.getUTCDate()-5);
  return { opens:open.toISOString().slice(0,10), due:last.toISOString().slice(0,10) };
}
export function applies(a, month) { return a.from<=month && (!a.until || a.until>=month); }
export function filterOccurrences(rows, f) {
  return rows.filter(r=>(!f.from||r.date>=f.from)&&(!f.to||r.date<=f.to)&&(!f.schoolId||r.schoolId===f.schoolId)&&(!f.contractId||r.contractId===f.contractId)&&(!f.type||r.type===f.type)&&(!f.severity||r.severity===f.severity)&&(!f.status||r.status===f.status)&&(!f.vehicle||r.vehicle.toLowerCase().includes(f.vehicle.toLowerCase()))&&(!f.driver||r.driver.toLowerCase().includes(f.driver.toLowerCase()))&&(!f.search||`${r.protocol} ${r.type} ${r.vehicle} ${r.driver}`.toLowerCase().includes(f.search.toLowerCase())));
}
export function daysOpen(r, now=new Date().toISOString()) { return Math.max(0,Math.floor((Date.parse(r.resolvedAt || now)-Date.parse(r.createdAt))/86400000)); }
export function groups(rows, field) { return Object.entries(rows.reduce((acc,r)=>({...acc,[r[field]]:(acc[r[field]]||0)+1}),{})).sort(([a],[b])=>a.localeCompare(b)); }
export function patterns(rows, settings, day=today()) {
  const cutoff=new Date(`${day}T12:00:00Z`);cutoff.setUTCDate(cutoff.getUTCDate()-settings.recurrenceDays);
  const recent=rows.filter(r=>r.date>=cutoff.toISOString().slice(0,10)&&r.date<=day);
  return ['vehicle','driver','schoolId','type','contractId'].map(field=>({field,groups:groups(recent,field).filter(([,n])=>n>=settings.recurrenceCount)}));
}
export function alertsFor(rows, settings, now=new Date().toISOString()) {
  return rows.filter(r=>!terminal(r)).flatMap(r=>{
    const warnings=[];const days=daysOpen(r,now);
    if(r.severity==='Alto')warnings.push('Gravidade alta informada pela escola');
    if(!r.attendedAt && days>=settings.unattendedDays)warnings.push(`Sem atendimento registrado há ${days} dias`);
    if(days>=settings.openDays)warnings.push(`Em aberto há ${days} dias`);
    return warnings.map(text=>({id:`${r.id}:${text}`,occurrenceId:r.id,protocol:r.protocol,text}));
  });
}
export function evaluationRows(state, month, actor, day=today()) {
  const window=evaluationWindow(month);
  return scoped(state.assignments,actor).filter(a=>applies(a,month)).map(a=>{
    const record=state.evaluations.find(e=>e.schoolId===a.schoolId&&e.contractId===a.contractId&&e.month===month);
    return {...a,month,record,status:record?.status||(day>=window.opens?'Disponível para preenchimento':'Não iniciada'),window};
  });
}
export function evaluationStats(rows) {
  const received=rows.filter(r=>r.record);
  const signatures=new Set(received.map(r=>JSON.stringify(r.record.criteria)));
  const scores=received.map(r=>r.record.criteria.reduce((s,c)=>s+r.record.answers[c.id]/c.max*100,0)/r.record.criteria.length);
  return {expected:rows.length,received:received.length,delivery:rows.length?received.length/rows.length*100:null,average:received.length&&signatures.size===1?scores.reduce((a,b)=>a+b,0)/scores.length:null,onTime:received.filter(r=>r.record.timeliness==='Entregue no prazo').length,late:received.filter(r=>r.record.timeliness==='Entregue em atraso').length,review:received.filter(r=>r.record.status==='Em revisão').length,correction:received.filter(r=>r.record.status==='Necessita correção').length,missing:rows.length-received.length};
}
export function csvCell(value) { const text=String(value??'');const safe=/^[\s]*[=+@-]/.test(text)?`'${text}`:text;return `"${safe.replaceAll('"','""')}"`; }

export function applyCommand(state, command, actor, now=new Date().toISOString(), day=today()) {
  const next=structuredClone(state);const data=command.data;
  const event=(from,to,note)=>({id:crypto.randomUUID(),from,to,note,at:now,actor:actor.name});
  if(command.type==='createOccurrence') {
    assertSchool(actor,data.schoolId);
    for(const key of ['schoolId','cie','contractId','date','time','vehicle','driver','place','type','description','severity'])if(!String(data[key]||'').trim())throw Error('Preencha todos os campos obrigatórios.');
    if(!CONTRACTS.some(c=>c.id===data.contractId)||!TYPES.includes(data.type)||!Object.keys(SEVERITIES).includes(data.severity))throw Error('Contrato, tipo ou gravidade inválidos.');
    if(!validDate(data.date)||data.date>day||!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time))throw Error('Data ou horário inválido; não registre ocorrência futura.');
    if(!/^\d{1,10}$/.test(data.cie))throw Error('Informe o CIE numérico da escola, preservando zeros iniciais.');
    if(data.type==='Outros'&&!data.other?.trim())throw Error('Especifique a ocorrência.');
    if(!data.evidences?.length)throw Error('Inclua ao menos uma evidência.');
    const id=crypto.randomUUID();const year=day.slice(0,4);const sequence=(next.sequences[year]||0)+1;next.sequences[year]=sequence;
    const row={...data,id,protocol:`TR-${year}-${String(sequence).padStart(4,'0')}`,createdAt:now,updatedAt:now,status:'Aberta',responsible:null,resolvedAt:null,attendedAt:null,reviewedSeverity:null,history:[event(null,'Aberta','Ocorrência enviada pela escola.')],source:'Registro local da escola'};
    next.occurrences.push(row);return {state:next,result:row};
  }
  if(command.type==='treatOccurrence') {
    assertManager(actor);const r=next.occurrences.find(o=>o.id===data.id);if(!r)throw Error('Ocorrência não encontrada.');
    if(r.updatedAt!==data.expectedVersion)throw Error('Registro atualizado em outra aba. Reabra o detalhamento.');
    if(!data.note?.trim()||!data.responsible?.trim())throw Error('Informe responsável e observação.');
    if(data.reviewedSeverity&&!Object.keys(SEVERITIES).includes(data.reviewedSeverity))throw Error('Classificação revisada inválida.');
    if(!STATUSES.includes(data.status)||STATUSES.indexOf(data.status)<STATUSES.indexOf(r.status)||r.status==='Encerrada')throw Error('Transição não permitida.');
    r.history.push({...event(r.status,data.status,data.note),action:data.action||'Observação',forwardedTo:data.forwardedTo||null,companyResponse:data.companyResponse||null,reviewedSeverity:data.reviewedSeverity||null});
    if(data.status==='Em atendimento'&&!r.attendedAt)r.attendedAt=now;
    if(['Resolvida','Encerrada'].includes(data.status)&&!r.resolvedAt)r.resolvedAt=now;
    Object.assign(r,{status:data.status,responsible:data.responsible,reviewedSeverity:data.reviewedSeverity||r.reviewedSeverity,updatedAt:now});return {state:next,result:r};
  }
  if(command.type==='assignment') {
    assertManager(actor);
    if(!data.schoolId||!/^\d{1,10}$/.test(data.cie)||!CONTRACTS.some(c=>c.id===data.contractId)||!validMonth(data.from)||(data.until&&(!validMonth(data.until)||data.until<data.from)))throw Error('Confira escola, CIE, contrato e competências do vínculo.');
    if(next.assignments.some(a=>a.schoolId===data.schoolId&&a.contractId===data.contractId))throw Error('Vínculo já cadastrado. Não crie outra avaliação para a mesma escola e contrato.');
    const row={...data,id:crypto.randomUUID(),createdAt:now,source:'Vínculo informado pelo SEAFIN'};next.assignments.push(row);next.configurationHistory.push(event(null,'Vínculo cadastrado',`${data.schoolId} · ${data.contractId}`));return {state:next,result:row};
  }
  if(command.type==='criterion') {
    assertManager(actor);if(!data.label?.trim()||!Number.isInteger(data.max)||data.max<1||data.max>100)throw Error('Informe critério e nota máxima inteira entre 1 e 100.');
    const row={id:crypto.randomUUID(),label:data.label.trim(),max:data.max,active:true};next.criteria.push(row);next.configurationHistory.push(event(null,'Critério cadastrado',data.label));return {state:next,result:row};
  }
  if(command.type==='toggleCriterion') {
    assertManager(actor);const c=next.criteria.find(c=>c.id===data.id);if(!c)throw Error('Critério não encontrado.');c.active=!c.active;next.configurationHistory.push(event(null,c.active?'Critério ativado':'Critério desativado',c.label));return {state:next,result:c};
  }
  if(command.type==='settings') {
    assertManager(actor);for(const key of Object.keys(next.settings))if(!Number.isInteger(data[key])||data[key]<1||data[key]>365)throw Error('Limites devem ser inteiros entre 1 e 365.');
    next.settings={...data};next.configurationHistory.push(event(null,'Limites atualizados',JSON.stringify(data)));return {state:next,result:next.settings};
  }
  if(command.type==='submitEvaluation') {
    assertSchool(actor,data.schoolId);const window=evaluationWindow(data.month);
    if(day<window.opens)throw Error(`Recebimento disponível a partir de ${window.opens}.`);
    const assignment=next.assignments.find(a=>a.schoolId===data.schoolId&&a.contractId===data.contractId&&applies(a,data.month));if(!assignment)throw Error('Vínculo escola/contrato não confirmado para esta competência.');
    const old=next.evaluations.find(e=>e.schoolId===data.schoolId&&e.contractId===data.contractId&&e.month===data.month);
    if(old&&old.status!=='Necessita correção')throw Error('Avaliação já enviada. O SEAFIN precisa solicitar correção para permitir reenvio.');
    const criteria=old?.criteria||next.criteria.filter(c=>c.active);if(!criteria.length)throw Error('Os critérios de avaliação ainda não foram configurados.');
    if(criteria.some(c=>!Number.isFinite(data.answers[c.id])||data.answers[c.id]<0||data.answers[c.id]>c.max))throw Error('Responda todos os critérios dentro da escala informada.');
    const timeliness=old?.timeliness||(day<=window.due?'Entregue no prazo':'Entregue em atraso');
    const row={id:old?.id||crypto.randomUUID(),schoolId:data.schoolId,contractId:data.contractId,cie:assignment.cie,month:data.month,opensAt:window.opens,submittedAt:old?.submittedAt||now,lastSubmittedAt:now,timeliness,status:timeliness,criteria,answers:data.answers,notes:data.notes||'',history:[...(old?.history||[]),{...event(old?.status||null,timeliness,old?'Correção reenviada':'Avaliação enviada'),answers:data.answers,notes:data.notes||''}]};
    if(old)next.evaluations=next.evaluations.map(e=>e.id===old.id?row:e);else next.evaluations.push(row);return {state:next,result:row};
  }
  if(command.type==='reviewEvaluation') {
    assertManager(actor);if(!REVIEW_STATUSES.includes(data.status)||!data.note?.trim())throw Error('Informe situação e observação da revisão.');
    const r=next.evaluations.find(e=>e.id===data.id);if(!r)throw Error('Avaliação não encontrada.');r.history.push(event(r.status,data.status,data.note));r.status=data.status;return {state:next,result:r};
  }
  throw Error('Operação desconhecida.');
}
